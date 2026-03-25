<!-- <script setup>
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
</template> -->

<script setup>
import { ref, computed, onMounted } from 'vue'
import StardCard from './StardCard.vue'
import { Users, Activity, Target, PawPrint, TrendingUp } from 'lucide-vue-next'
import dashboardService from '@/services/dashboard.js'
import { Pie, Line } from 'vue-chartjs'
import { useLoginStore } from '@/stores/login.store.js'
const loginStore = useLoginStore()
const logged = loginStore.token
const currentUser = loginStore.getDecodedToken
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
} from 'chart.js'

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
)

const statsData = ref(null)
const overviewData = ref(null)
const loading = ref(true)

// Simulation du département du chef (à récupérer depuis ton Store/Auth)
const chefDept = ref(currentUser.dept?.name) // Par défaut à 'Bovins' si non défini

const fetchData = async () => {
  try {
    loading.value = true
    // On récupère les données (ton backend devrait idéalement filtrer par dept pour le chef)
    const [stats, overview] = await Promise.all([
      dashboardService.getStats(),
      dashboardService.getOverview(),
    ])
    statsData.value = stats
    overviewData.value = overview
    console.log('Données chargées pour le Chef:', { stats, overview })
  } catch (error) {
    console.error('Erreur chargement chef', error)
  } finally {
    loading.value = false
  }
}


// --- FILTRAGE RÉACTIF DES CAMPAGNES ---
const myCampaigns = computed(() => {
  // On vérifie que les données sont chargées
  if (!overviewData.value?.campaigns) return []
  
  // Filtrage par nom de département (vérifie bien que ton API renvoie l'objet departement avec un name)
  return overviewData.value.campaigns.filter(
    (c) => c.departement?.name === chefDept.value || c.dept?.name === chefDept.value
  )
})

// --- Graphique Pie (Utilise maintenant myCampaigns) ---
const pieData = computed(() => {
  if (myCampaigns.value.length === 0) return null
  return {
    labels: myCampaigns.value.map((c) => c.name),
    datasets: [
      {
        data: myCampaigns.value.map((c) => c.animalsCount || 0),
        backgroundColor: ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6'],
        borderWidth: 0,
      },
    ],
  }
})


const lineData = computed(() => {
  return {
    labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai'],
    datasets: [
      {
        label: 'Dépenses',
        data: [120000, 150000, 180000, 170000, 200000],
        borderColor: '#10B981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        fill: true,
        tension: 0.4,
      },
    ],
  }
})

// --- Stats Cards adaptées au Chef ---
const dynamicStats = computed(() => {
  if (!statsData.value) return []
  return [
    {
      title: 'Animaux (Dépt)',
      value: statsData.value.totalAnimals || 0,
      subText: chefDept.value,
      colorClass: 'text-emerald-500',
      icon: PawPrint,
    },
    {
      title: 'Mes Campagnes',
      value: myCampaigns.value.length, // Plus besoin de .length sur une ref() ici car c'est une computed
      subText: 'En cours / Planifiées',
      colorClass: 'text-purple-500',
      icon: Target,
    },
    {
      title: 'Ventes Dépt',
      value: overviewData.value?.recentSales?.length || 0,
      subText: 'Ce mois-ci',
      colorClass: 'text-blue-500',
      icon: Activity,
    },
    {
      title: 'Budget Consommé',
      value: '65%',
      subText: 'Sur le total alloué',
      colorClass: 'text-orange-500',
      icon: TrendingUp,
    },
  ]
})

// --- Filtrage des ventes pour ne voir que celles de son département ---
const recentActivities = computed(() => {
  if (!overviewData.value?.recentSales) return []
  return overviewData.value.recentSales
    .filter((s) => s.dept === chefDept.value) // Filtrage important
    .map((sale) => ({
      id: sale._id,
      desc: `Vente : ${sale.product}`,
      user: sale.clientName || sale.client,
      time: new Date(sale.date).toLocaleDateString(),
      amount: sale.totalAmount?.toLocaleString() + ' F',
    }))
})

onMounted(fetchData)
</script>

<template>
  <main class="flex-1 lg:ml-64 p-4 lg:p-8 bg-slate-50 min-h-screen space-y-8">
    <div v-if="loading" class="flex justify-center items-center h-64">
      <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-500"></div>
    </div>

    <template v-else>
      <header class="flex justify-between items-end mb-8">
        <div>
          <h2 class="text-2xl font-bold text-slate-800">Espace Chef : {{ chefDept }}</h2>
          <p class="text-slate-500 text-sm">Gestion des campagnes et objectifs du département</p>
        </div>
        <div
          class="bg-emerald-100 text-emerald-700 px-4 py-2 rounded-xl text-xs font-bold uppercase"
        >
          Département Actif
        </div>
      </header>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StardCard v-for="stat in dynamicStats" :key="stat.title" v-bind="stat" />
      </div>

      <div class="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div class="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <h3 class="font-bold text-slate-800 mb-6">Répartition Animaux par Campagne</h3>
          <div class="h-[300px]">
            <Pie v-if="pieData" :data="pieData" :options="{ maintainAspectRatio: false }" />
            <p v-else class="text-center text-slate-400 mt-20">Aucune campagne active</p>
          </div>
        </div>

        <div class="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <h3 class="font-bold text-slate-800 mb-6">Dépenses du Département (FCFA)</h3>
          <div class="h-[300px]">
            <Line
              v-if="lineData && lineData.labels"
              :data="lineData"
              :options="{ responsive: true, maintainAspectRatio: false }"
            />
          </div>
        </div>
      </div>

      <div class="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
  <div class="flex items-center justify-between mb-6">
    <h3 class="font-bold text-slate-800">Suivi des Campagnes {{ chefDept }}</h3>
    <span v-if="myCampaigns?.length" class="text-xs font-medium text-slate-400">
      {{ myCampaigns.length }} campagne(s) trouvée(s)
    </span>
  </div>

  <div v-if="myCampaigns?.length > 0" class="overflow-x-auto">
    <table class="w-full text-left">
      <thead>
        <tr class="text-xs font-bold text-slate-400 uppercase tracking-wider border-b">
          <th class="pb-4">Campagne</th>
          <th class="pb-4">Status</th>
          <th class="pb-4">Effectif</th>
          <th class="pb-4">Responsable</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-slate-50">
        <tr v-for="camp in myCampaigns" :key="camp._id" class="text-sm group hover:bg-slate-50/50 transition-colors">
          <td class="py-4 font-bold text-slate-700">{{ camp.name }}</td>
          <td class="py-4">
            <span
              :class="
                camp.status === 'actif'
                  ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                  : 'bg-slate-50 text-slate-500 border border-slate-200'
              "
              class="px-2 py-1 rounded-md text-[10px] font-bold uppercase"
            >
              {{ camp.status }}
            </span>
          </td>
          <td class="py-4 text-slate-600 font-medium">{{ camp.animalsCount }} têtes</td>
          <td class="py-4 text-slate-500 italic">
            {{ camp.manager?.name || 'Non assigné' }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <div v-else class="py-12 flex flex-col items-center justify-center text-center">
    <div class="bg-slate-50 p-4 rounded-full mb-4">
      <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    </div>
    <h4 class="text-slate-900 font-semibold">Aucune campagne en cours</h4>
    <p class="text-slate-500 text-sm max-w-[250px] mt-1">
      Il n'y a actuellement aucune campagne enregistrée pour votre département.
    </p>
  </div>
</div>
    </template>
  </main>
</template>
