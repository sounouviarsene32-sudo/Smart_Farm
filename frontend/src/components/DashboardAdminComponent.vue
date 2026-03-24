<script setup>
import { ref, computed } from 'vue'
import StardCard from './StardCard.vue'
import { Users, Activity, Percent, Target, TrendingUp, TrendingDown, Beef, PawPrint } from 'lucide-vue-next'

// Importations Chart.js
import { Pie, Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
} from 'chart.js'
import ChartDataLabels from 'chartjs-plugin-datalabels'

// Gestion des interfaces

const stats = [
  {
    title: 'Total Animaux',
    value: '1250',
    subText: 'Répartis sur 4 départements',
    colorClass: 'text-emerald-500',
    icon: PawPrint,
    trend: null,
  },
  {
    title: 'Taux de Mortalité',
    value: '3.2%',
    subText: 'vs mois dernier',
    trend: '0.5%',
    trendIsUp: false, // Flèche rouge vers le bas
    colorClass: 'text-rose-500',
    icon: Activity,
  },
  {
    title: 'Employés Actifs',
    value: '68.5%',
    subText: 'vs mois dernier',
    trend: '+5.2%',
    trendIsUp: true, // Flèche bleue/verte vers le haut
    colorClass: 'text-blue-500',
    icon: Users,
  },
  {
    title: 'Campagnes Actives',
    value: '8',
    subText: 'Sur 15 campagnes total',
    colorClass: 'text-purple-500',
    icon: Target,
    trend: null,
  },
]

// Enregistrement global des composants Chart.js
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  ChartDataLabels,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
)

// --- États de l'interface ---
const sidebarOpen = ref(false)

// --- Données pour le Graphique en Secteurs (Revenu par Département) ---
const secteurData = {
  labels: ['Volaille', 'Bovins', 'Caprins', 'Ovins'],
  datasets: [
    {
      data: [36, 30.4, 19.2, 14.4],
      backgroundColor: ['#10B981', '#3B82F6', '#F59E0B', '#EF4444'],
      borderWidth: 2,
      borderColor: '#ffffff',
    },
  ],
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
      font: { weight: 'bold', size: 12 },
    },
  },
  layout: { padding: 30 },
}

// --- Données pour le Graphique Linéaire (Évolution Revenu) ---
const expenseStats = ref([
  { month: 'Oct', volaille: 400000, bovins: 350000, caprins: 200000, ovins: 150000 },
  { month: 'Nov', volaille: 420000, bovins: 370000, caprins: 220000, ovins: 170000 },
  { month: 'Déc', volaille: 480000, bovins: 390000, caprins: 245000, ovins: 185000 },
  // ... ajoute le reste de tes données ici
])

const lineData = computed(() => ({
  labels: ['Oct', 'Nov', 'Déc', 'Jan', 'Fév', 'Mar'],
  datasets: [
    {
      label: 'Volaille',
      borderColor: '#10B981', // Vert
      data: [400000, 420000, 480000, 450000, 470000, 500000],
      tension: 0.3,
      pointRadius: 4,
    },
    {
      label: 'Bovins',
      borderColor: '#3B82F6', // Bleu
      data: [350000, 370000, 390000, 380000, 400000, 420000],
      tension: 0.3,
      pointRadius: 4,
    },
    {
      label: 'Caprins',
      borderColor: '#F59E0B', // Orange
      data: [200000, 220000, 245000, 230000, 250000, 270000],
      tension: 0.3,
      pointRadius: 4,
    },
    {
      label: 'Ovins',
      borderColor: '#EF4444', // Rouge
      data: [150000, 170000, 185000, 180000, 190000, 200000],
      tension: 0.3,
      pointRadius: 4,
    },
  ],
}))

const lineOptions = {
  responsive: true,
  maintainAspectRatio: false,
  interaction: {
    mode: 'index',
    intersect: false,
  },
  plugins: {
    legend: { display: false },
    tooltip: {
      enabled: true,
      backgroundColor: 'white',
      titleColor: '#1e293b', // Slate 800
      bodyColor: '#64748b', // Slate 500
      borderColor: '#e2e8f0', // Slate 200
      borderWidth: 1,
      padding: 12,
      boxPadding: 6,
      usePointStyle: true,
      callbacks: {
        title: (context) => {
          return context[0].label // Affiche le mois (ex: Déc)
        },
        label: (context) => {
          // Formattage personnalisé : Nom : Valeur FCFA
          let label = context.dataset.label || ''
          let value = context.parsed.y.toLocaleString()
          return `${label} : ${value} FCFA`
        },
        labelTextColor: (context) => {
          // Force le texte du tooltip à prendre la couleur de la ligne
          return context.dataset.borderColor
        },
      },
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      grid: { color: '#f1f5f9' },
      ticks: { stepSize: 150000 },
    },
    x: { grid: { display: false } },
  },
}

// --- Estimation de revenu par catégorie ---
const categories = ref([
  { name: 'Volaille', value: '4,500,000' },
  { name: 'Bovins', value: '3,800,000' },
  { name: 'Caprins', value: '2,400,000' },
  { name: 'Ovins', value: '1,800,000' },
])

// activités récentes
const activities = ref([
  {
    id: 1,
    type: 'Vente',
    desc: 'Vente de 50 poulets',
    user: 'Jean Dupont',
    time: 'Il y a 2h',
    cat: 'Volaille',
  },
  {
    id: 2,
    type: 'Santé',
    desc: 'Vaccination de 20 bovins',
    user: 'Marie Martin',
    time: 'Il y a 3h',
    cat: 'Bovins',
  },
])
</script>

<template>

    <main class="flex-1 lg:ml-64 p-4 lg:p-8 transition-all duration-300 w-full bg-red-50 min-h-screen space-y-8">
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
        <StardCard v-for="stat in stats" :key="stat.title" v-bind="stat" />
      </div>

      <div class="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
        <div class="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm h-100">
          <h3 class="font-bold text-slate-800 mb-6">Revenu par Département</h3>
          <div class="h-75">
            <Pie :data="secteurData" :options="secteurOptions" />
          </div>
        </div>

        <div
          class="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm h-100 flex flex-col"
        >
          <h3 class="font-bold text-slate-800 mb-6">Estimation des Dépenses par Département</h3>

          <div class="h-[280px] w-full relative">
            <Line :data="lineData" :options="lineOptions" />
          </div>

          <div class="flex justify-center items-center gap-4 mt-auto pb-2">
            <div
              v-for="dataset in lineData.datasets"
              :key="dataset.label"
              class="flex items-center gap-1.5"
            >
              <span
                class="w-2.5 h-2.5 rounded-full border-2 bg-white"
                :style="{ borderColor: dataset.borderColor }"
              ></span>
              <span class="text-[11px] font-medium text-slate-400 capitalize">
                {{ dataset.label }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div
            class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-2"
          >
            <h3 class="font-bold text-slate-800">Estimation Revenu Global</h3>
            <span class="text-xl font-bold text-emerald-600">12,500,000 FCFA</span>
          </div>
          <div class="space-y-4">
            <div
              v-for="item in categories"
              :key="item.name"
              class="flex justify-between items-center border-b border-slate-50 pb-2"
            >
              <span class="text-slate-500">{{ item.name }}</span>
              <span class="font-semibold text-slate-700">{{ item.value }} FCFA</span>
            </div>
          </div>
        </div>

        <div class="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <h3 class="font-bold text-slate-800 mb-6">Activités Récentes</h3>
          <div class="space-y-6">
            <div v-for="act in activities" :key="act.id" class="flex gap-4 items-start">
              <div
                class="w-2 h-2 rounded-full mt-2"
                :class="act.cat === 'Volaille' ? 'bg-emerald-500' : 'bg-blue-500'"
              ></div>
              <div class="flex-1">
                <p class="text-sm font-bold text-slate-800">{{ act.desc }}</p>
                <p class="text-xs text-slate-400">{{ act.user }} • {{ act.time }}</p>
              </div>
              <span
                class="text-[10px] bg-slate-100 px-2 py-1 rounded text-slate-500 uppercase font-bold"
                >{{ act.cat }}</span
              >
            </div>
          </div>
        </div>
      </div>
    </main>
</template>
