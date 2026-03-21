<script setup>
import { 
  Plus, Box, AlertTriangle, TrendingDown, 
  ShoppingCart, Search, UserCircle, ShieldAlert 
} from 'lucide-vue-next';

const stockStats = [
  { label: 'Total Articles', value: '9', icon: Box, color: 'text-blue-500' },
  { label: 'Stock Critique', value: '1', icon: ShieldAlert, color: 'text-rose-500' },
  { label: 'Stock Faible', value: '1', icon: TrendingDown, color: 'text-orange-500' },
  { label: 'Alertes Actives', value: '2', icon: ShoppingCart, color: 'text-purple-500' },
];

const stockAlerts = [
  { name: 'Vaccin Newcastle', message: 'Stock critique - Réapprovisionnement urgent', type: 'critique' },
  { name: 'Aliment Bovins', message: 'Stock faible - Commande recommandée', type: 'faible' },
];

const inventory = [
  { name: 'Aliment Volaille', quantity: '2500', minStock: '1000', unit: 'kg', status: 'Normal', percent: 100, statusClass: 'bg-emerald-500 text-white', progressColor: 'bg-emerald-500', supplier: 'SEDIMA', lastUpdate: '18/03/2026' },
  { name: 'Aliment Bovins', quantity: '1800', minStock: '2000', unit: 'kg', status: 'Faible', percent: 45, statusClass: 'bg-orange-500 text-white', progressColor: 'bg-orange-500', supplier: 'SEDIMA', lastUpdate: '17/03/2026' },
  { name: 'Aliment Caprins', quantity: '800', minStock: '500', unit: 'kg', status: 'Normal', percent: 100, statusClass: 'bg-emerald-500 text-white', progressColor: 'bg-emerald-500', supplier: 'NMA Sanders', lastUpdate: '18/03/2026' },
  { name: 'Aliment Ovins', quantity: '650', minStock: '500', unit: 'kg', status: 'Normal', percent: 100, statusClass: 'bg-emerald-500 text-white', progressColor: 'bg-emerald-500', supplier: 'NMA Sanders', lastUpdate: '18/03/2026' },
  { name: 'Vaccin Newcastle', quantity: '100', minStock: '200', unit: 'doses', status: 'Critique', percent: 20, statusClass: 'bg-rose-500 text-white', progressColor: 'bg-rose-500', supplier: 'VETOQUINOL', lastUpdate: '15/03/2026' },
  { name: 'Vaccin Fièvre Aphteuse', quantity: '350', minStock: '150', unit: 'doses', status: 'Normal', percent: 100, statusClass: 'bg-emerald-500 text-white', progressColor: 'bg-emerald-500', supplier: 'VETOQUINOL', lastUpdate: '16/03/2026' },
  { name: 'Antiparasitaire', quantity: '45', minStock: '30', unit: 'litres', status: 'Normal', percent: 100, statusClass: 'bg-emerald-500 text-white', progressColor: 'bg-emerald-500', supplier: 'Pharmacie Vétérinaire', lastUpdate: '17/03/2026' },
  { name: 'Antibiotique large spectre', quantity: '25', minStock: '20', unit: 'flacons', status: 'Normal', percent: 100, statusClass: 'bg-emerald-500 text-white', progressColor: 'bg-emerald-500', supplier: 'Pharmacie Vétérinaire', lastUpdate: '18/03/2026' },
  { name: 'Désinfectant', quantity: '80', minStock: '50', unit: 'litres', status: 'Normal', percent: 100, statusClass: 'bg-emerald-500 text-white', progressColor: 'bg-emerald-500', supplier: 'SENPRODAL', lastUpdate: '16/03/2026' },
];
</script>

<template>
  <main class="flex-1 lg:ml-64 p-4 lg:p-8 transition-all duration-300 w-full p-8 bg-[#F8F9FA] min-h-screen space-y-8">
    <header class="flex justify-between items-start">
      <div>
        <h1 class="text-2xl font-bold text-slate-900">Gestion du Stock</h1>
        <p class="text-slate-500 text-sm">Inventaire et approvisionnement</p>
      </div>
      <button class="bg-slate-950 text-white px-4 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 transition-transform hover:scale-105 active:scale-95">
        <Plus class="w-4 h-4" /> Ajouter un Article
      </button>
    </header>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div v-for="stat in stockStats" :key="stat.label" class="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex justify-between items-center">
        <div>
          <p class="text-xs font-medium text-slate-400 mb-1">{{ stat.label }}</p>
          <p class="text-2xl font-bold text-slate-900">{{ stat.value }}</p>
        </div>
        <component :is="stat.icon" :class="['w-8 h-8', stat.color]" />
      </div>
    </div>

    <div class="bg-[#FFF8F1] border border-[#FFE7D3] p-6 rounded-2xl space-y-4">
      <div class="flex items-center gap-2 text-[#935D27] font-bold text-sm uppercase tracking-wide">
        <AlertTriangle class="w-5 h-5" /> Alertes de Stock
      </div>
      <div class="space-y-3">
        <div v-for="alert in stockAlerts" :key="alert.name" class="bg-white p-4 rounded-xl border border-[#FFE7D3] flex justify-between items-center shadow-sm">
          <div>
            <h4 class="font-bold text-slate-900 text-sm">{{ alert.name }}</h4>
            <p :class="['text-xs font-medium', alert.type === 'critique' ? 'text-rose-500' : 'text-orange-500']">
              {{ alert.message }}
            </p>
          </div>
          <button class="bg-slate-950 text-white px-5 py-2 rounded-lg text-xs font-bold hover:bg-slate-800">
            Commander
          </button>
        </div>
      </div>
    </div>

    <div class="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <div class="p-6 border-b border-slate-50 flex justify-between items-center">
        <h2 class="font-bold text-slate-800">Inventaire</h2>
        <div class="relative">
          <Search class="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input type="text" placeholder="Rechercher..." class="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-950 w-64" />
        </div>
      </div>
      
      <table class="w-full text-left text-sm">
        <thead class="bg-slate-50/50 text-slate-400 font-semibold text-xs uppercase tracking-wider">
          <tr>
            <th class="px-6 py-4">Article</th>
            <th class="px-6 py-4">Quantité</th>
            <th class="px-6 py-4">Stock Min</th>
            <th class="px-6 py-4">Statut</th>
            <th class="px-6 py-4">Fournisseur</th>
            <th class="px-6 py-4">Dernière MAJ</th>
            <th class="px-6 py-4 text-center">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-50">
          <tr v-for="item in inventory" :key="item.name" class="hover:bg-slate-50/30 transition-colors">
            <td class="px-6 py-4 flex items-center gap-3">
              <Box class="w-4 h-4 text-slate-300" />
              <span class="font-bold text-slate-800">{{ item.name }}</span>
            </td>
            <td class="px-6 py-4 font-bold text-slate-900">{{ item.quantity }} {{ item.unit }}</td>
            <td class="px-6 py-4 text-slate-400">{{ item.minStock }} {{ item.unit }}</td>
            <td class="px-6 py-4">
              <div class="w-24">
                <div :class="['text-[10px] font-bold uppercase px-2 py-0.5 rounded inline-block mb-1', item.statusClass]">
                  {{ item.status }}
                </div>
                <div class="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div :class="['h-full rounded-full', item.progressColor]" :style="{ width: item.percent + '%' }"></div>
                </div>
              </div>
            </td>
            <td class="px-6 py-4 text-slate-500 font-medium">{{ item.supplier }}</td>
            <td class="px-6 py-4 text-slate-500">{{ item.lastUpdate }}</td>
            <td class="px-6 py-4 text-center">
              <button class="text-slate-700 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-md text-[11px] font-bold hover:bg-slate-100">
                Détails
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
</main>
</template>


<style scoped>


</style>