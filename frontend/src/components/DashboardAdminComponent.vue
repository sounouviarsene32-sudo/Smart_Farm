<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios' // Ou ton instance api configurée
import StardCard from './StardCard.vue'
import { Users, Activity, Target, PawPrint } from 'lucide-vue-next'
import { Pie, Line } from 'vue-chartjs'
// ... (garder tes imports ChartJS actuels)

// --- États des données ---
import dashboardService from '@/services/dashboard.js'
const statsData = ref(null)
const overviewData = ref(null)
const loading = ref(true)

// --- Appel API ---

const fetchData = async () => {
  try {
    loading.value = true
    
    // Appel via le service centralisé
    const stats = await dashboardService.getStats()
     const overview = await dashboardService.getOverview()
    
    statsData.value = stats
    overviewData.value = overview
    
  } catch (error) {
    console.error("Erreur de chargement du dashboard", error)
  } finally {
    loading.value = false
  }
}

// --- Mapping dynamique des Stats Cards ---
const dynamicStats = computed(() => {
  if (!statsData.value) return []
  return [
    {
      title: 'Total Animaux',
      value: statsData.value.totalAnimals,
      subText: 'Enregistrés en base',
      colorClass: 'text-emerald-500',
      icon: PawPrint,
    },
    {
      title: 'Campagnes Actives',
      value: statsData.value.activeCampaigns,
      subText: `Sur ${statsData.value.totalCampaigns} au total`,
      colorClass: 'text-purple-500',
      icon: Target,
    },
    {
      title: 'Ventes Totales',
      value: statsData.value.totalSales,
      subText: 'Toutes catégories',
      colorClass: 'text-blue-500',
      icon: Activity,
    },
    // On peut ajouter une stat fixe ou calculée ici
    {
      title: 'Performance',
      value: '92%',
      subText: 'Estimation globale',
      colorClass: 'text-orange-500',
      icon: Users,
    }
  ]
})

// --- Activités Récentes (Ventes) ---
const recentActivities = computed(() => {
  if (!overviewData.value) return []
  return overviewData.value?.recentSales?.map(sale => ({
    id: sale._id,
    desc: `Vente de ${sale.quantity || ''} ${sale.product || 'Produit'}`,
    user: sale.client || 'Client anonyme',
    time: new Date(sale.createdAt).toLocaleDateString(),
    cat: sale.category || 'Vente'
  }))
})

onMounted(fetchData)
</script>

<template>
  <main class="flex-1 lg:ml-64 p-4 lg:p-8 bg-red-50 min-h-screen space-y-8">
    
    <div v-if="loading" class="flex justify-center items-center h-64">
       <p class="text-slate-500 font-bold animate-pulse">Chargement des données...</p>
    </div>

    <template v-else>
      <header class="flex justify-between items-start mb-8">
        <div>
          <h2 class="text-2xl font-bold text-slate-800">Dashboard</h2>
          <p class="text-slate-500 text-sm">Données réelles de l'exploitation</p>
        </div>
      </header>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StardCard v-for="stat in dynamicStats" :key="stat.title" v-bind="stat" />
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <h3 class="font-bold text-slate-800 mb-6">Ventes Récentes</h3>
          <div class="space-y-6">
            <div v-for="act in recentActivities" :key="act.id" class="flex gap-4 items-start border-b border-slate-50 pb-4 last:border-0">
              <div class="w-2 h-2 rounded-full mt-2 bg-blue-500"></div>
              <div class="flex-1">
                <p class="text-sm font-bold text-slate-800">{{ act.desc }}</p>
                <p class="text-xs text-slate-400">{{ act.user }} • {{ act.time }}</p>
              </div>
              <span class="text-[10px] bg-slate-100 px-2 py-1 rounded text-slate-500 uppercase font-bold">
                {{ act.cat }}
              </span>
            </div>
          </div>
        </div>
        
        <div class="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <h3 class="font-bold text-slate-800 mb-6">Dernières Campagnes</h3>
          <div class="space-y-4">
            <div v-for="camp in overviewData?.campaigns" :key="camp._id" class="flex justify-between items-center">
              <span class="text-slate-600 font-medium">{{ camp.name }}</span>
              <span :class="camp.status === 'actif' ? 'text-emerald-600' : 'text-slate-400'" class="text-xs font-bold uppercase">
                {{ camp.status }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </template>
  </main>
</template>