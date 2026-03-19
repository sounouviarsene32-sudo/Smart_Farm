<script setup>
import { ref, computed } from 'vue'
import AppSidebar from './AppSidebar.vue'
import StardCard from './StardCard.vue'
import { Users, Activity, Percent, Target, TrendingUp, TrendingDown } from 'lucide-vue-next'

// Importations Chart.js
import { Pie, Line } from 'vue-chartjs'
import { 
  Chart as ChartJS, 
  ArcElement, Tooltip, Legend, CategoryScale, 
  LinearScale, PointElement, LineElement 
} from 'chart.js'
import ChartDataLabels from 'chartjs-plugin-datalabels'


// Gestion des interfaces 

const stats = [
  {
    title: "Total Animaux",
    value: "1250",
    subText: "Répartis sur 4 départements",
    colorClass: "text-emerald-500",
    icon: Users,
    trend: null
  },
  {
    title: "Taux de Mortalité",
    value: "3.2%",
    subText: "vs mois dernier",
    trend: "0.5%",
    trendIsUp: false, // Flèche rouge vers le bas
    colorClass: "text-rose-500",
    icon: Activity
  },
  {
    title: "Rentabilité",
    value: "68.5%",
    subText: "vs mois dernier",
    trend: "+5.2%",
    trendIsUp: true, // Flèche bleue/verte vers le haut
    colorClass: "text-blue-500",
    icon: Percent
  },
  {
    title: "Campagnes Actives",
    value: "8",
    subText: "Sur 15 campagnes total",
    colorClass: "text-purple-500",
    icon: Target,
    trend: null
  }
]

// Enregistrement global des composants Chart.js
ChartJS.register(
  ArcElement, Tooltip, Legend, ChartDataLabels, 
  CategoryScale, LinearScale, PointElement, LineElement
)

// --- États de l'interface ---
const sidebarOpen = ref(false)

// --- Données pour le Graphique en Secteurs (Revenu par Département) ---
const secteurData = {
  labels: ['Volaille', 'Bovins', 'Caprins', 'Ovins'],
  datasets: [{
    data: [36, 30.4, 19.2, 14.4],
    backgroundColor: ['#10B981', '#3B82F6', '#F59E0B', '#EF4444'],
    borderWidth: 2,
    borderColor: '#ffffff'
  }]
}

const secteurOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    datalabels: {
      anchor: 'end',
      align: 'end',
      offset: 10,
      formatter: (value, ctx) => `${ctx.chart.data.labels[ctx.dataIndex]} ${value}%`,
      color: (ctx) => ctx.dataset.backgroundColor[ctx.dataIndex],
      font: { weight: 'bold', size: 12 }
    }
  },
  layout: { padding: 30 }
}

// --- Données pour le Graphique Linéaire (Évolution Revenu) ---
const monthlyStats = ref([
  { month: 'Oct', revenu: 420000 },
  { month: 'Nov', revenu: 450000 },
  { month: 'Déc', revenu: 480000 },
  { month: 'Jan', revenu: 470000 },
  { month: 'Fév', revenu: 495000 },
  { month: 'Mar', revenu: 530000 }
])

const lineData = computed(() => ({
  labels: monthlyStats.value.map(d => d.month),
  datasets: [{
    label: 'Revenu Mensuel',
    borderColor: '#EF4444',
    backgroundColor: '#EF4444',
    data: monthlyStats.value.map(d => d.revenu),
    tension: 0.3,
    pointRadius: 4
  }]
}))

const lineOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: {
    y: { beginAtZero: true, grid: { color: '#f1f5f9' } },
    x: { grid: { display: false } }
  }
}

// --- Données Simulées pour les listes ---
const categories = ref([
  { name: 'Volaille', value: '4,500,000' },
  { name: 'Bovins', value: '3,800,000' },
  { name: 'Caprins', value: '2,400,000' },
  { name: 'Ovins', value: '1,800,000' }
])

const activities = ref([
  { id: 1, type: 'Vente', desc: 'Vente de 50 poulets', user: 'Jean Dupont', time: 'Il y a 2h', cat: 'Volaille' },
  { id: 2, type: 'Santé', desc: 'Vaccination de 20 bovins', user: 'Marie Martin', time: 'Il y a 3h', cat: 'Bovins' }
])
</script>

<template>
  <div class="flex min-h-screen bg-[#F8F9FA]">
    <AppSidebar :sidebar-open="sidebarOpen" @close="sidebarOpen = false" />

    <main class="flex-1 lg:ml-64 p-4 lg:p-8 transition-all duration-300 w-full">
      
      <header class="flex justify-between items-start mb-8">
        <div>
          <h2 class="text-2xl font-bold text-slate-800">Dashboard Administrateur</h2>
          <p class="text-slate-500 text-sm">Vue d'ensemble de l'exploitation</p>
        </div>
        <div class="hidden sm:block text-right text-sm text-slate-400">
          <p>Saison: <span class="text-slate-900 font-semibold">2025/2026</span></p>
          <p>Date: <span class="text-slate-900 font-semibold">19/03/2026</span></p>
        </div>
      </header>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
    <StardCard 
      v-for="stat in stats" 
      :key="stat.title"
      v-bind="stat"
    />
  </div>

      <div class="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
        <div class="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm h-[400px]">
          <h3 class="font-bold text-slate-800 mb-6">Revenu par Département</h3>
          <div class="h-[300px]">
             <Pie :data="secteurData" :options="secteurOptions" />
          </div>
        </div>
        
        <div class="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm h-[400px]">
          <h3 class="font-bold text-slate-800 mb-6">Évolution du Revenu Mensuel</h3>
          <div class="h-[300px]">
            <Line :data="lineData" :options="lineOptions" />
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-2">
             <h3 class="font-bold text-slate-800">Estimation Revenu Global</h3>
             <span class="text-xl font-bold text-emerald-600">12,500,000 FCFA</span>
          </div>
          <div class="space-y-4">
            <div v-for="item in categories" :key="item.name" class="flex justify-between items-center border-b border-slate-50 pb-2">
              <span class="text-slate-500">{{ item.name }}</span>
              <span class="font-semibold text-slate-700">{{ item.value }} FCFA</span>
            </div>
          </div>
        </div>

        <div class="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <h3 class="font-bold text-slate-800 mb-6">Activités Récentes</h3>
          <div class="space-y-6">
            <div v-for="act in activities" :key="act.id" class="flex gap-4 items-start">
              <div class="w-2 h-2 rounded-full mt-2" :class="act.cat === 'Volaille' ? 'bg-emerald-500' : 'bg-blue-500'"></div>
              <div class="flex-1">
                <p class="text-sm font-bold text-slate-800">{{ act.desc }}</p>
                <p class="text-xs text-slate-400">{{ act.user }} • {{ act.time }}</p>
              </div>
              <span class="text-[10px] bg-slate-100 px-2 py-1 rounded text-slate-500 uppercase font-bold">{{ act.cat }}</span>
            </div>
          </div>
        </div>
      </div>

    </main>
  </div>
</template>