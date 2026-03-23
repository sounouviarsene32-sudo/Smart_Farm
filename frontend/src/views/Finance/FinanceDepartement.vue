<script setup>
import { Pie } from 'vue-chartjs'
import {
  DollarSign,
  CreditCard,
  Wallet,
  Percent,
  TrendingUp,
  ArrowUpRight,
  ArrowDownLeft,
  Building2,
  LayoutDashboard,
} from 'lucide-vue-next'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'

ChartJS.register(ArcElement, Tooltip, Legend)

// Stats Globales
const financialStats = [
  { title: 'Revenus Totaux', value: '12 500 000', icon: DollarSign, color: 'emerald' },
  { title: 'Dépenses Totales', value: '8 750 000', icon: CreditCard, color: 'orange' },
  { title: 'Bénéfice Net', value: '3 750 000', icon: Wallet, color: 'blue' },
  { title: 'Marge', value: '30%', icon: Percent, color: 'purple' },
]

// Données par Département (Nouvelle Section)
const departmentsData = [
  { name: 'Volaille', revenus: 5500000, depenses: 2100000, color: 'bg-emerald-500' },
  { name: 'Bovins', revenus: 4200000, depenses: 3500000, color: 'bg-blue-500' },
  { name: 'Ovins', revenus: 2800000, depenses: 3150000, color: 'bg-orange-500' },
]

const pieData = {
  labels: ['Alimentation', 'Santé', 'Personnel', 'Infrastructure', 'Autres'],
  datasets: [
    {
      data: [40, 20, 24, 10, 6],
      backgroundColor: ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6'],
      borderWidth: 0,
      hoverOffset: 20,
    },
  ],
}

const pieOptions = {
  plugins: { legend: { display: false } },
  maintainAspectRatio: false,
  cutout: '70%', // Transforme le Pie en Doughnut pour un look plus moderne
}

const transactions = [
  {
    id: 1,
    title: 'Vente 100 poulets',
    date: '18/03/2026',
    category: 'Vente',
    amount: '250 000',
    type: 'vente',
    status: 'Complété',
  },
  {
    id: 2,
    title: 'Achat aliment 1T',
    date: '18/03/2026',
    category: 'Alimentation',
    amount: '150 000',
    type: 'depense',
    status: 'Complété',
  },
  {
    id: 5,
    title: 'Salaires agents',
    date: '16/03/2026',
    category: 'Personnel',
    amount: '350 000',
    type: 'depense',
    status: 'En attente',
  },
]

// Helper pour formater les prix
const formatPrice = (val) => new Intl.NumberFormat('fr-FR').format(val) + ' FCFA'
const getProgress = (dep, rev) => Math.min((dep / rev) * 100, 100)
</script>

<template>
  <main class="flex-1 lg:ml-64 p-6 lg:p-10 bg-red-50 min-h-screen space-y-10">
    <header>
      <div>
        <h1 class="text-3xl font-black text-slate-900 tracking-tight">Analyses financières</h1>
      </div>
      <!-- <div class="hidden md:block text-right">
        <p class="text-xs font-bold text-slate-400 uppercase">Période Actuelle</p>
        <p class="text-sm font-bold text-slate-900">Mars 2026</p>
      </div> -->
    </header>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div
        v-for="stat in financialStats"
        :key="stat.title"
        class="group bg-white p-6 rounded-lg border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
      >
        <div class="flex justify-between items-center mb-4">
          <div
            class="p-3 rounded-2xl transition-transform"
            :class="[`bg-${stat.color}-50`, `text-${stat.color}-600`]"
          > <component :is="stat.icon"  class="w-5 h-5" /> </div>
          <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">{{
            stat.title
          }}</span>
        </div>
        <div class="text-2xl font-black text-slate-900">
          {{ stat.value }} <span class="text-xs font-medium text-slate-400">FCFA</span>
        </div>
      </div>
    </div>


    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div class="bg-slate-900 p-8 shadow-2xl text-white relative overflow-hidden">
        <div class="relative z-10">
          <h3 class="font-bold mb-8 text-lg opacity-80 uppercase tracking-widest">
            Répartition des Dépenses
          </h3>
          <div class="flex flex-col md:flex-row items-center gap-10">
            <div class="w-44 h-44">
              <Pie :data="pieData" :options="pieOptions" />
            </div>
            <div class="flex-1 space-y-4 w-full">
              <div
                v-for="(label, index) in pieData.labels"
                :key="label"
                class="flex justify-between items-center"
              >
                <div class="flex items-center gap-3">
                  <span
                    class="w-2 h-2 rounded-full"
                    :style="{ backgroundColor: pieData.datasets[0].backgroundColor[index] }"
                  ></span>
                  <span class="text-xs font-medium text-white/60">{{ label }}</span>
                </div>
                <span class="text-xs font-bold">{{ pieData.datasets[0].data[index] }}%</span>
              </div>
            </div>
          </div>
        </div>
        <div class="absolute -right-10 -bottom-10 w-40 h-40 bg-white/5 rounded-full blur-3xl"></div>
      </div>

      <div class="bg-white p-8 border border-slate-100 shadow-sm">
        <h3 class="font-bold text-slate-800 mb-8 text-lg">Transactions</h3>
        <div class="space-y-5">
          <div
            v-for="tx in transactions"
            :key="tx.id"
            class="group flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 transition-colors"
          >
            <div class="flex items-center gap-4">
              <div
                :class="[
                  tx.type === 'vente'
                    ? 'bg-emerald-50 text-emerald-600'
                    : 'bg-orange-50 text-orange-600',
                  'p-3 rounded-2xl transition-transform group-hover:rotate-12',
                ]"
              >
                <component
                  :is="tx.type === 'vente' ? ArrowUpRight : ArrowDownLeft"
                  class="w-5 h-5"
                />
              </div>
              <div>
                <div class="font-bold text-slate-900 text-sm">{{ tx.title }}</div>
                <div class="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                  {{ tx.category }} • {{ tx.date }}
                </div>
              </div>
            </div>
            <div class="text-right">
              <div
                :class="[
                  tx.type === 'vente' ? 'text-emerald-600' : 'text-orange-600',
                  'font-black text-sm',
                ]"
              >
                {{ tx.type === 'vente' ? '+' : '-' }}{{ tx.amount }}
                <span class="text-[10px]">CFA</span>
              </div>
              <span
                :class="[
                  tx.status === 'Complété'
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-500',
                  'text-[9px] font-black px-2 py-0.5 rounded-lg uppercase tracking-tighter',
                ]"
              >
                {{ tx.status }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.5s ease-out;
}
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
