<script setup>
import { ref, computed } from 'vue';
import { Pie } from 'vue-chartjs';
import { Download, Plus, DollarSign, ShoppingCart, Users, TrendingUp, Search } from 'lucide-vue-next';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const searchQuery = ref('');

const salesStats = [
  { label: 'Ventes Totales', value: '12 500 000 F CFA', icon: DollarSign, color: 'text-emerald-500' },
  { label: 'Transactions', value: '8', icon: ShoppingCart, color: 'text-blue-500' },
  { label: 'Clients Actifs', value: '5', icon: Users, color: 'text-purple-500' },
  { label: 'Croissance', value: '+15.2%', icon: TrendingUp, color: 'text-orange-500' },
];

const salesByDept = [
  { name: 'Volaille', percent: 36, amount: '4 500 000', color: '#10B981' },
  { name: 'Bovins', percent: 30.4, amount: '3 800 000', color: '#3B82F6' },
  { name: 'Caprins', percent: 19.2, amount: '2 400 000', color: '#F59E0B' },
  { name: 'Ovins', percent: 14.4, amount: '1 800 000', color: '#EF4444' },
];

const pieData = {
  labels: salesByDept.map(d => d.name),
  datasets: [{
    data: salesByDept.map(d => d.percent),
    backgroundColor: salesByDept.map(d => d.color),
    borderWidth: 0,
    hoverOffset: 10
  }]
};

const pieOptions = {
  plugins: { legend: { display: false }, tooltip: { callbacks: { label: (ctx) => `${ctx.label} : ${ctx.parsed}%` } } },
  maintainAspectRatio: false,
  cutout: '0%' // Full pie
};

const topClients = ref([
  { id: 1, name: 'Boucherie Moderne', transactions: 12, amount: '2 850 000' },
  { id: 2, name: 'Restaurant La Paix', transactions: 18, amount: '1 920 000' },
  { id: 3, name: 'Supermarché Fresh', transactions: 24, amount: '1 650 000' },
  { id: 4, name: 'Marché Central', transactions: 15, amount: '1 340 000' },
  { id: 5, name: 'Hôtel Luxe', transactions: 8, amount: '980 000' },
]);

const recentTransactions = ref([
  { id: 1, date: '18/03/2026', client: 'Restaurant La Paix', dept: 'Volaille', product: 'Poulets', quantity: 100, unitPrice: '2 500', total: '250 000', status: 'Payé' },
  { id: 2, date: '17/03/2026', client: 'Boucherie Moderne', dept: 'Bovins', product: 'Bœufs', quantity: 5, unitPrice: '240 000', total: '1 200 000', status: 'Payé' },
  { id: 3, date: '17/03/2026', client: 'Supermarché Fresh', dept: 'Volaille', product: 'Œufs (plateaux)', quantity: 150, unitPrice: '300', total: '45 000', status: 'Payé' },
  { id: 4, date: '16/03/2026', client: 'Restaurant Teranga', dept: 'Caprins', product: 'Chèvres', quantity: 15, unitPrice: '25 000', total: '375 000', status: 'En attente' },
  { id: 5, date: '15/03/2026', client: 'Marché Central', dept: 'Ovins', product: 'Moutons', quantity: 8, unitPrice: '35 000', total: '280 000', status: 'Payé' },
  { id: 6, date: '15/03/2026', client: 'Hôtel Luxe', dept: 'Volaille', product: 'Poulets Bio', quantity: 50, unitPrice: '3 500', total: '175 000', status: 'Payé' },
  { id: 7, date: '14/03/2026', client: 'Boucherie du Coin', dept: 'Bovins', product: 'Veaux', quantity: 3, unitPrice: '180 000', total: '540 000', status: 'Payé' },
  { id: 8, date: '13/03/2026', client: 'Restaurant Saveurs', dept: 'Caprins', product: 'Chevreaux', quantity: 10, unitPrice: '18 000', total: '180 000', status: 'Payé' },
]);

const filteredTransactions = computed(() => {
  const query = searchQuery.value.toLowerCase().trim();
  if (!query) return recentTransactions.value;
  return recentTransactions.value.filter(tx => 
    tx.client.toLowerCase().includes(query) || 
    tx.product.toLowerCase().includes(query)
  );
});
</script>

<template>
  <main class="flex-1 lg:ml-64 p-4 lg:p-8 transition-all duration-300 w-full bg-red-50 min-h-screen space-y-8">
    <header class="flex justify-between items-start">
      <div>
        <h1 class="text-3xl font-bold text-slate-900">Ventes</h1>
        <p class="text-slate-500 text-sm">Gestion des transactions et clients</p>
      </div>
      <div class="flex items-center gap-3">
        <button class="bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 hover:bg-slate-50">
          <Download class="w-4 h-4" /> Exporter
        </button>
        <button class="bg-slate-950 text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 hover:bg-slate-800">
          <Plus class="w-4 h-4" /> Nouvelle Vente
        </button>
      </div>
    </header>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div v-for="stat in salesStats" :key="stat.label" class="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex justify-between items-center hover:shadow-md transition-shadow">
        <div>
          <p class="text-xs font-medium text-slate-400 mb-1.5">{{ stat.label }}</p>
          <p class="text-2xl font-bold text-slate-900">{{ stat.value }}</p>
        </div>
        <component :is="stat.icon" :class="['w-8 h-8', stat.color]" />
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div class="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <h3 class="font-bold text-slate-800 mb-8 text-lg">Ventes par Département</h3>
        <div class="flex items-center gap-8 flex-col md:flex-row">
          <div class="w-56 h-56 flex-shrink-0">
            <Pie :data="pieData" :options="pieOptions" />
          </div>
          <div class="flex-1 space-y-4 w-full">
            <div v-for="(item, index) in salesByDept" :key="item.name" class="flex justify-between items-center">
              <div class="flex items-center gap-2.5">
                <span class="w-3.5 h-3.5 rounded-full" :style="{ backgroundColor: item.color }"></span>
                <span class="text-slate-600 font-medium text-sm">{{ item.name }} ({{ item.percent }}%)</span>
              </div>
              <span class="font-bold text-slate-900 text-sm">{{ item.amount }} FCFA</span>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <h3 class="font-bold text-slate-800 mb-6 text-lg">Meilleurs Clients</h3>
        <div class="space-y-5">
          <div v-for="(client, index) in topClients" :key="client.id" class="flex items-center justify-between gap-4">
            <div class="flex items-center gap-4 flex-1">
              <div class="bg-blue-50 text-blue-600 w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm">
                {{ index + 1 }}
              </div>
              <div class="min-w-0 flex-1">
                <div class="font-bold text-slate-900 text-sm truncate">{{ client.name }}</div>
                <div class="text-[11px] text-slate-400 font-medium tracking-tight">
                  {{ client.transactions }} transactions
                </div>
              </div>
            </div>
            <div class="text-right text-emerald-500 font-bold text-sm flex-shrink-0">
              {{ client.amount }} FCFA
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <div class="p-6 border-b border-slate-50 flex justify-between items-center gap-4 flex-wrap">
        <h2 class="font-bold text-slate-800">Transactions Récentes</h2>
        <div class="relative w-full max-w-xs">
          <Search class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            v-model="searchQuery"
            type="search"
            placeholder="Rechercher un client ou un produit..." 
            class="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-slate-950 focus:border-slate-950 outline-none transition-all"
          />
        </div>
      </div>
      
      <table class="w-full text-left text-sm border-collapse">
        <thead class="bg-slate-50/50 text-slate-400 font-semibold text-xs uppercase tracking-wider">
          <tr>
            <th class="px-6 py-4">Date</th>
            <th class="px-6 py-4">Client</th>
            <th class="px-6 py-4 text-center">Département</th>
            <th class="px-6 py-4">Produit</th>
            <th class="px-6 py-4 text-center">Quantité</th>
            <th class="px-6 py-4 text-right">Prix Unitaire</th>
            <th class="px-6 py-4 text-right">Total</th>
            <th class="px-6 py-4 text-center">Statut</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-50 font-medium">
          <tr v-for="tx in filteredTransactions" :key="tx.id" class="hover:bg-slate-50/30 transition-colors">
            <td class="px-6 py-4 text-slate-500">{{ tx.date }}</td>
            <td class="px-6 py-4 font-bold text-slate-950">{{ tx.client }}</td>
            <td class="px-6 py-4 text-center">
              <span class="bg-slate-100 px-3 py-1 rounded text-[11px] font-bold text-slate-600 border border-slate-200">
                {{ tx.dept }}
              </span>
            </td>
            <td class="px-6 py-4 text-slate-500">{{ tx.product }}</td>
            <td class="px-6 py-4 text-center font-bold text-slate-900">{{ tx.quantity }}</td>
            <td class="px-6 py-4 text-right text-slate-500">{{ tx.unitPrice }} FCFA</td>
            <td class="px-6 py-4 text-right font-bold text-emerald-500">{{ tx.total }} FCFA</td>
            <td class="px-6 py-4 text-center">
              <span :class="[tx.status === 'Payé' ? 'bg-emerald-500 text-white' : 'bg-orange-500 text-white', 'px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-tight']">
                {{ tx.status }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
</main>
</template>