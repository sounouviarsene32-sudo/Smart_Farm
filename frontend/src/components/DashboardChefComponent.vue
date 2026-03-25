<script setup>
import { ref, computed, onMounted } from 'vue'
import StardCard from './StardCard.vue'
import { Users, Activity, Target, PawPrint } from 'lucide-vue-next'
import { Pie, Line } from 'vue-chartjs'
import dashboardService from '@/services/dashboard.js'

// --- États ---
const statsData = ref(null)
const overviewData = ref(null)
const loading = ref(true)

// Simulation du département du chef (à récupérer depuis ton Store/Auth)
const chefDept = ref('Bovins')

const fetchData = async () => {
  try {
    loading.value = true
    // On récupère les données globales (tu pourras plus tard créer un endpoint 
    // dédié /api/dashboard/dept/:id pour plus de précision)
    const [stats, overview] = await Promise.all([
      dashboardService.getStats(),
      dashboardService.getOverview()
    ])
    statsData.value = stats
    overviewData.value = overview
  } catch (error) {
    console.error("Erreur Chef Dashboard:", error)
  } finally {
    loading.value = false
  }
}

// --- Stats filtrées pour le Chef ---
const dynamicStats = computed(() => {
  if (!statsData.value) return []
  return [
    {
      title: `Animaux (${chefDept.value})`,
      value: statsData.value.totalAnimals || 0,
      subText: 'Total du département',
      colorClass: 'text-emerald-500',
      icon: PawPrint,
    },
    {
      title: 'Performance Agents',
      value: statsData.value.totalAgents || '528', // À rendre dynamique via ton backend
      subText: 'Agents sous votre direction',
      colorClass: 'text-blue-500',
      icon: Users,
    },
    {
      title: 'Taux de Mortalité',
      value: '2.8%', 
      subText: 'Objectif: < 3%',
      colorClass: 'text-rose-500',
      icon: Activity,
    },
    {
      title: 'Campagnes Dept',
      value: statsData.value.activeCampaigns || 0,
      subText: 'Opérations en cours',
      colorClass: 'text-purple-500',
      icon: Target,
    },
  ]
})

// --- Graphiques Dynamiques ---
const secteurData = computed(() => ({
  labels: ['Santé', 'Vente', 'Naissance', 'Perte'],
  datasets: [{
    data: [45, 25, 20, 10], // Idéalement, calcule cela depuis overviewData.recentSales
    backgroundColor: ['#10B981', '#3B82F6', '#F59E0B', '#EF4444'],
  }]
}))

onMounted(fetchData)
</script>

<template>
  <main class="flex-1 lg:ml-64 p-4 lg:p-8 bg-red-50 min-h-screen space-y-8">
    
    <div v-if="loading" class="flex justify-center items-center h-64">
       <p class="text-slate-500 animate-pulse font-bold">Analyse des données départementales...</p>
    </div>

    <template v-else>
      <header class="flex justify-between items-start mb-8">
        <div>
          <h2 class="text-2xl font-bold text-slate-800">Dashboard Chef : {{ chefDept }}</h2>
          <p class="text-slate-500 text-sm">Gestion des ressources et performances</p>
        </div>
        <div class="hidden sm:block text-right text-sm text-slate-400">
          <p>Saison: <span class="text-slate-900 font-semibold">2025/2026</span></p>
          <p>Statut: <span class="text-emerald-600 font-bold uppercase text-[10px] bg-emerald-50 px-2 py-1 rounded">En ligne</span></p>
        </div>
      </header>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StardCard v-for="stat in dynamicStats" :key="stat.title" v-bind="stat" />
      </div>

      <div class="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
        <div class="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm h-[400px]">
          <h3 class="font-bold text-slate-800 mb-6">Répartition des Activités</h3>
          <div class="h-[280px]">
            <Pie :data="secteurData" :options="secteurOptions" />
          </div>
        </div>

        <div class="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm h-[400px]">
          <h3 class="font-bold text-slate-800 mb-6">Évolution des Dépenses (FCFA)</h3>
          <div class="h-[280px]">
            <Line :data="lineData" :options="lineOptions" />
          </div>
        </div>
      </div>

      <div class="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <h3 class="font-bold text-slate-800 mb-6">Flux d'activités du département</h3>
        <div class="space-y-6">
          <div v-for="act in overviewData?.recentSales" :key="act._id" class="flex gap-4 items-center border-b border-slate-50 pb-4 last:border-0">
             <div class="p-2 bg-slate-50 rounded-lg">
                <Activity class="w-5 h-5 text-slate-400" />
             </div>
             <div class="flex-1">
               <p class="text-sm font-bold text-slate-800">Vente de {{ act.quantity }} unités</p>
               <p class="text-xs text-slate-400">Agent: {{ act.agent?.name || 'Inconnu' }} • {{ new Date(act.createdAt).toLocaleDateString() }}</p>
             </div>
             <span class="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
               {{ act.category }}
             </span>
          </div>
        </div>
      </div>
    </template>
  </main>
</template>