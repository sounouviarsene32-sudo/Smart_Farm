
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

// Département du chef (depuis le token décodé)
const chefDept = computed(() => {
  return (
    currentUser?.deptName ||
    currentUser?.dept?.name ||
    currentUser?.dept ||
    'Département inconnu'
  )
})

const fetchData = async () => {
  try {
    loading.value = true
    const deptId =
      currentUser?.dept ||
      currentUser?.deptId ||
      currentUser?.dept?._id ||
      currentUser?.dept?.id ||
      null

    console.log('Dashboard fetchData currentUser:', currentUser)
    console.log('Dashboard fetchData deptId:', deptId)

    const [stats, overview] = await Promise.all([
      dashboardService.getStats(),
      deptId
        ? dashboardService.getOverviewByDept(deptId)
        : dashboardService.getOverview(),
    ])

    statsData.value = stats
    overviewData.value = overview
    console.log('Données chargées pour le Chef:', { stats, overview, deptId })
    console.log('Campaigns in overview:', overview?.campaigns)
    console.log('My campaigns after filtering:', myCampaigns.value)
  } catch (error) {
    console.error('Erreur chargement chef', error)
  } finally {
    loading.value = false
  }
}


// --- FILTRAGE RÉACTIF DES CAMPAGNES ---
const chefDeptId = computed(() => {
  const dept = currentUser?.dept || {}
  return dept?._id || dept?.id || dept || null
})

const chefDeptName = computed(() => {
  const dept = currentUser?.dept || {}
  return dept?.name || (typeof dept === 'string' ? dept : null)
})

const myCampaigns = computed(() => {
  if (!overviewData.value?.campaigns) return []

  const currentDeptId = chefDeptId.value?.toString()
  const currentDeptName = chefDeptName.value
  console.log('myCampaigns filtering', { currentDeptId, currentDeptName })

  return overviewData.value.campaigns.filter((campaign) => {
    const deps = Array.isArray(campaign.departement)
      ? campaign.departement
      : campaign.departement
      ? [campaign.departement]
      : []

    if (Array.isArray(deps) && deps.length === 0 && campaign.dept) {
      // backup if property is 'dept'
      deps.push(campaign.dept)
    }

    return deps.some((dep) => {
      if (!dep) return false
      if (typeof dep === 'string') {
        const depStr = dep.toString()
        return depStr === currentDeptId || depStr === currentDeptName
      }

      const depId = dep._id?.toString() || dep.id?.toString() || dep.toString()
      const depName = dep.name
      return (
        depId === currentDeptId ||
        depId === currentDeptName ||
        depName === currentDeptName ||
        depName === currentDeptId
      )
    })
  })
})
//     return deps.some((dep) => {
//       if (!dep) return false
//       if (typeof dep === 'string') {
//         return dep === chefDeptId.value || dep === chefDeptName.value
//       }
//       const depId = dep._id || dep.id
//       const depName = dep.name
//       return (
//         depId === chefDeptId.value ||
//         depId === chefDeptName.value ||
//         depName === chefDeptName.value ||
//         depName === chefDeptId.value
//       )
//     })
//   })
// })

// --- Graphique Pie (Utilise maintenant myCampaigns) ---
const pieData = computed(() => {
  console.log('pieData computed - myCampaigns:', myCampaigns.value)
  console.log('pieData computed - overviewData:', overviewData.value)

  if (!myCampaigns.value || myCampaigns.value.length === 0) {
    console.log('pieData: No campaigns found')
    return null
  }

  // Filtrer les campagnes qui ont des animaux (pour éviter les 0)
  const campaignsWithAnimals = myCampaigns.value.filter(c => (c.animalsCount || 0) > 0)

  if (campaignsWithAnimals.length === 0) {
    console.log('pieData: No campaigns with animals')
    return null
  }

  const data = {
    labels: campaignsWithAnimals.map((c) => c.name),
    datasets: [
      {
        data: campaignsWithAnimals.map((c) => {
          const count = c.animalsCount || 0
          console.log(`Campaign ${c.name}: animalsCount = ${count}`)
          return count
        }),
        backgroundColor: ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6'],
        borderWidth: 0,
      },
    ],
  }

  console.log('pieData final:', data)
  return data
})

// Key pour forcer le re-render du graphique quand les données changent
const pieChartKey = computed(() => {
  return pieData.value ? JSON.stringify(pieData.value) : 'no-data'
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

const pieOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom',
      labels: {
        color: '#334155',
      },
    },
    tooltip: {
      callbacks: {
        label: (context) => `${context.label}: ${context.parsed} animaux`,
      },
    },
  },
}

const lineOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        callback: (value) => `${value / 1000}k`,
      },
    },
  },
}


// --- Stats Cards adaptées au Chef ---
const dynamicStats = computed(() => {
  if (!statsData.value) return []

  // Calculer le nombre total d'animaux dans les campagnes du chef
  const totalAnimalsInDept = myCampaigns.value.reduce((total, campaign) => {
    return total + (campaign.animalsCount || 0)
  }, 0)

  return [
    {
      title: 'Animaux (Dépt)',
      value: totalAnimalsInDept,
      subText: chefDept.value,
      colorClass: 'text-emerald-500',
      icon: PawPrint,
    },
    {
      title: 'Mes Campagnes',
      value: myCampaigns.value.length,
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
            <Pie
              v-if="pieData && pieData.datasets && pieData.datasets[0] && pieData.datasets[0].data.length > 0"
              :key="pieChartKey"
              :data="pieData"
              :options="pieOptions"
            />
            <p v-else class="text-center text-slate-400 mt-20">
              {{ myCampaigns.length > 0 ? 'Chargement des données...' : 'Aucune campagne avec animaux' }}
            </p>
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
