<script setup>
import { Pie } from 'vue-chartjs'
import {
  DollarSign,
  CreditCard,
  Wallet,
  Percent,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownLeft,
} from 'lucide-vue-next'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'

ChartJS.register(ArcElement, Tooltip, Legend)

const financialStats = [
  {
    title: 'Revenus Totaux',
    value: '12 500 000 FCFA',
    icon: DollarSign,
    iconColor: 'text-emerald-500',
    trend: '+12.5%',
    trendColor: 'text-emerald-500',
    trendIcon: TrendingUp,
  },
  {
    title: 'Dépenses Totales',
    value: '8 750 000 FCFA',
    icon: CreditCard,
    iconColor: 'text-orange-500',
    trend: '+8.3%',
    trendColor: 'text-orange-500',
    trendIcon: TrendingUp,
  },
  {
    title: 'Bénéfice Net',
    value: '3 750 000 FCFA',
    icon: Wallet,
    iconColor: 'text-blue-500',
    trend: '+18.2%',
    trendColor: 'text-blue-500',
    trendIcon: TrendingUp,
  },
  {
    title: 'Marge Bénéficiaire',
    value: '30%',
    icon: Percent,
    iconColor: 'text-purple-500',
    trend: '+2.1%',
    trendColor: 'text-purple-500',
    trendIcon: TrendingUp,
  },
]

const amounts = ['3 500 000', '1 750 000', '2 100 000', '875 000', '525 000']
const pieData = {
  labels: ['Alimentation', 'Santé & Soins', 'Personnel', 'Infrastructure', 'Autres'],
  datasets: [
    {
      data: [40, 20, 24, 10, 6],
      backgroundColor: ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6'],
      borderWidth: 0,
    },
  ],
}

const pieOptions = {
  plugins: { legend: { display: false } },
  maintainAspectRatio: false,
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
    id: 3,
    title: 'Vente 5 bovins',
    date: '17/03/2026',
    category: 'Vente',
    amount: '1 200 000',
    type: 'vente',
    status: 'Complété',
  },
  {
    id: 4,
    title: 'Vaccins volaille',
    date: '17/03/2026',
    category: 'Santé',
    amount: '85 000',
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
  {
    id: 6,
    title: 'Vente œufs',
    date: '16/03/2026',
    category: 'Vente',
    amount: '45 000',
    type: 'vente',
    status: 'Complété',
  },
]
</script>

<template>
  <main class="flex-1 lg:ml-64 p-4 lg:p-8 transition-all duration-300 w-full p-8 bg-[#F8F9FA] min-h-screen space-y-8">
    <header>
      <h1 class="text-3xl font-bold text-slate-900">Finance</h1>
      <p class="text-slate-500 text-sm">Vue d'ensemble des revenus et dépenses</p>
    </header>

    <div class="grid grid-cols-1 my-10 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div
        v-for="stat in financialStats"
        :key="stat.title"
        class="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm"
      >
        <div class="flex justify-between items-start mb-4">
          <span class="text-sm font-medium text-slate-500">{{ stat.title }}</span>
          <component :is="stat.icon" :class="['w-6 h-6', stat.iconColor]" />
        </div>
        <div class="text-xl font-bold text-slate-900 mb-2">{{ stat.value }}</div>
        <div :class="['text-xs font-bold flex items-center gap-1', stat.trendColor]">
          <component :is="stat.trendIcon" class="w-3 h-3" />
          {{ stat.trend }}
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 mt-20 lg:grid-cols-2 gap-8">
      <div class="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col">
        <h3 class="font-bold text-slate-800 mb-8 text-lg">Dépenses par Catégorie</h3>

        <div class="flex flex-col md:flex-row items-center gap-8">
          <div class="w-48 h-48">
            <Pie :data="pieData" :options="pieOptions" />
          </div>

          <div class="flex-1 space-y-3 w-full">
            <div
              v-for="(val, index) in pieData.datasets[0].data"
              :key="index"
              class="flex justify-between items-center text-sm"
            >
              <div class="flex items-center gap-2">
                <span
                  class="w-3 h-3 rounded-full"
                  :style="{ backgroundColor: pieData.datasets[0].backgroundColor[index] }"
                ></span>
                <span class="text-slate-600 font-medium">{{ pieData.labels[index] }}</span>
              </div>
              <span class="font-bold text-slate-800">{{ amounts[index] }} FCFA</span>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <h3 class="font-bold text-slate-800 mb-6 text-lg">Transactions Récentes</h3>
        <div class="space-y-6">
          <div v-for="tx in transactions" :key="tx.id" class="flex items-center justify-between">
            <div class="flex items-center gap-4">
              <div
                :class="[
                  tx.type === 'vente'
                    ? 'bg-emerald-50 text-emerald-500'
                    : 'bg-orange-50 text-orange-500',
                  'p-3 rounded-xl',
                ]"
              >
                <component
                  :is="tx.type === 'vente' ? ArrowUpRight : ArrowDownLeft"
                  class="w-5 h-5"
                />
              </div>
              <div>
                <div class="font-bold text-slate-900 text-sm">{{ tx.title }}</div>
                <div class="text-[11px] text-slate-400 font-medium uppercase tracking-tight">
                  {{ tx.date }} • {{ tx.category }}
                </div>
              </div>
            </div>
            <div class="text-right">
              <div
                :class="[
                  tx.type === 'vente' ? 'text-emerald-500' : 'text-orange-500',
                  'font-bold text-sm',
                ]"
              >
                {{ tx.type === 'vente' ? '+' : '-' }}{{ tx.amount }} FCFA
              </div>
              <span
                :class="[
                  tx.status === 'Complété' ? 'bg-black text-white' : 'bg-slate-100 text-slate-600',
                  'text-[10px] font-bold px-2 py-0.5 rounded uppercase',
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

<style scoped></style>
