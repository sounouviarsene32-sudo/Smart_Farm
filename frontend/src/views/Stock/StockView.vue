<script setup>
import { ref, onMounted, computed } from 'vue';
import {
  Plus, Box, AlertTriangle, TrendingDown,
  ShoppingCart, Search, UserCircle, ShieldAlert
} from 'lucide-vue-next';
import api from '@/api/axios.config.js';
import NewStockModal from '@/components/NewStockModal.vue';
import StockDetailModal from '@/components/StockDetailModal.vue';

const isModalOpen = ref(false);
const isDetailModalOpen = ref(false);
const selectedItem = ref(null);
const inventory = ref([]);
const searchQuery = ref('');

// Statistiques réelles
const stockStats = computed(() => {
  const total = inventory.value.length;
  const critique = inventory.value.filter(item => item.quantity <= item.threshold).length;
  const faible = inventory.value.filter(item => item.quantity > item.threshold && item.quantity <= item.threshold * 2).length;

  return [
    { label: 'Total Articles', value: total, icon: Box, color: 'text-blue-500' },
    { label: 'Stock Critique', value: critique, icon: ShieldAlert, color: 'text-rose-500' },
    { label: 'Stock Faible', value: faible, icon: TrendingDown, color: 'text-orange-500' },
    { label: 'Alertes Actives', value: critique + faible, icon: ShoppingCart, color: 'text-purple-500' },
  ];
});

// Alertes de stock
const stockAlerts = computed(() => {
  return inventory.value
    .filter(item => item.quantity <= item.threshold)
    .map(item => ({
      name: item.name,
      message: `Stock critique (${item.quantity} ${item.unit}) - Réapprovisionnement urgent`,
      type: 'critique'
    }))
    .slice(0, 3); // Limiter à 3 alertes
});

// Récupération des données
const fetchStock = async () => {
  try {
    const res = await api.get('/stock');
    inventory.value = res.data;
  } catch (error) {
    console.error("Erreur lors du chargement du stock :", error);
  }
};

onMounted(fetchStock);

const onStockAdded = (newStock) => {
  inventory.value.unshift(newStock);
};

const onStockDeleted = (id) => {
  inventory.value = inventory.value.filter(item => item._id !== id);
};

const onStockUpdated = (updatedStock) => {
  const index = inventory.value.findIndex(item => item._id === updatedStock._id);
  if (index !== -1) {
    inventory.value[index] = updatedStock;
  }
};

const openDetails = (item) => {
  selectedItem.value = item;
  isDetailModalOpen.value = true;
};

// Filtrage pour la recherche
const filteredInventory = computed(() => {
  const query = searchQuery.value.toLowerCase().trim();
  if (!query) return inventory.value;
  return inventory.value.filter(item =>
    item.name.toLowerCase().includes(query) ||
    item.category.toLowerCase().includes(query) ||
    item.supplier?.toLowerCase().includes(query)
  );
});

// Helper pour le statut
const getStatusInfo = (item) => {
  const ratio = item.quantity / item.threshold;
  if (ratio <= 1) return { label: 'Critique', class: 'bg-rose-500 text-white', progress: 'bg-rose-500', percent: Math.min(100, (item.quantity / item.threshold) * 100) };
  if (ratio <= 2) return { label: 'Faible', class: 'bg-orange-500 text-white', progress: 'bg-orange-500', percent: 50 };
  return { label: 'Normal', class: 'bg-emerald-500 text-white', progress: 'bg-emerald-500', percent: 100 };
};
</script>

<template>
  <main class="flex-1 lg:ml-64 p-4 lg:p-8 transition-all duration-300 w-full bg-red-50 min-h-screen space-y-8">
    <header class="flex justify-between items-start">
      <div>
        <h1 class="text-2xl font-bold text-slate-900">Gestion du Stock</h1>
        <p class="text-slate-500 text-sm">Inventaire et approvisionnement</p>
      </div>
      <button @click="isModalOpen = true"
        class="bg-slate-950 text-white px-4 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 transition-transform hover:scale-105 active:scale-95">
        <Plus class="w-4 h-4" /> Ajouter un Article
      </button>

      <NewStockModal :is-open="isModalOpen" @close="isModalOpen = false" @stock-added="onStockAdded" />

      <StockDetailModal :is-open="isDetailModalOpen" :item="selectedItem" @close="isDetailModalOpen = false"
        @stock-deleted="onStockDeleted" @stock-updated="onStockUpdated" />
    </header>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div v-for="stat in stockStats" :key="stat.label"
        class="bg-white p-6 rounded-lg  shadow-sm flex justify-between items-center">
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
        <div v-if="stockAlerts.length === 0"
          class="text-slate-400 text-sm py-4 text-center italic bg-white/50 rounded-xl">
          Aucune alerte de stock en cours.
        </div>
        <div v-for="alert in stockAlerts" :key="alert.name"
          class="bg-white p-4 rounded-xl border border-[#FFE7D3] flex justify-between items-center shadow-sm">
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

    <div class="bg-white shadow-sm overflow-hidden rounded-2xl border border-slate-100">
      <div class="p-6 border-b border-slate-50 flex justify-between items-center">
        <h2 class="font-bold text-slate-800">Inventaire</h2>
        <div class="relative">
          <Search class="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input v-model="searchQuery" type="text" placeholder="Rechercher..."
            class="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-950 w-64" />
        </div>
      </div>

      <table class="w-full text-left text-sm border-collapse">
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
          <tr v-for="item in filteredInventory" :key="item._id" class="hover:bg-slate-50/30 transition-colors">
            <td class="px-6 py-4 flex items-center gap-3">
              <Box class="w-4 h-4 text-slate-300" />
              <div class="flex flex-col">
                <span class="font-bold text-slate-800">{{ item.name }}</span>
                <span class="text-[10px] text-slate-400 uppercase tracking-tighter">{{ item.category }}</span>
              </div>
            </td>
            <td class="px-6 py-4 font-bold text-slate-900">{{ item.quantity }} {{ item.unit }}</td>
            <td class="px-6 py-4 text-slate-400">{{ item.threshold }} {{ item.unit }}</td>
            <td class="px-6 py-4">
              <div class="w-24">
                <div
                  :class="['text-[10px] font-bold uppercase px-2 py-0.5 rounded inline-block mb-1', getStatusInfo(item).class]">
                  {{ getStatusInfo(item).label }}
                </div>
                <div class="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div :class="['h-full rounded-full', getStatusInfo(item).progress]"
                    :style="{ width: getStatusInfo(item).percent + '%' }"></div>
                </div>
              </div>
            </td>
            <td class="px-6 py-4 text-slate-500 font-medium">{{ item.supplier || 'N/A' }}</td>
            <td class="px-6 py-4 text-slate-500">{{ new Date(item.lastUpdated).toLocaleDateString('fr-FR') }}</td>
            <td class="px-6 py-4 text-center">
              <button @click="openDetails(item)"
                class="text-slate-700 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-md text-[11px] font-bold hover:bg-slate-100 transition-all">
                Détails
              </button>
            </td>
          </tr>
          <tr v-if="filteredInventory.length === 0">
            <td colspan="7" class="px-6 py-12 text-center text-slate-400 italic">
              Aucun article trouvé dans l'inventaire.
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </main>
</template>


<style scoped></style>