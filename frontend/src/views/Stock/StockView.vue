<script setup>
import { 
  Plus, Box, AlertTriangle, TrendingDown, 
  ShoppingCart, Search, ShieldAlert, X 
} from 'lucide-vue-next';

import api from '@/api/axios.config.js';
import { ref, computed, onMounted } from 'vue';

// --- DATA DYNAMIQUE ---
const stockStats = ref([]);
const stockAlerts = ref([]);

// Load dashboard data
const loadDashboard = async () => {
  try {
    const [statsRes, alertsRes] = await Promise.all([
      api.get('/stock/stats'),
      api.get('/stock/alerts')
    ]);
    
    const rawStats = statsRes.data;
    stockStats.value = [
      { label: 'Total Articles', value: rawStats.total.toString(), icon: Box, color: 'text-blue-500' },
      { label: 'Stock Critique', value: rawStats.critical.toString(), icon: ShieldAlert, color: 'text-rose-500' },
      { label: 'Stock Faible', value: rawStats.low.toString(), icon: TrendingDown, color: 'text-orange-500' },
      { label: 'Alertes Actives', value: rawStats.alerts.toString(), icon: ShoppingCart, color: 'text-purple-500' }
    ];
    
    stockAlerts.value = alertsRes.data;
  } catch (error) {
    console.error('Erreur load dashboard:', error);
  }
};


// --- LOGIQUE D'INVENTAIRE ---
const inventory = ref([]);

// Load dynamic data
const loadInventory = async () => {
  try {
    const response = await api.get('/stock');
    inventory.value = response.data.map(item => ({
      ...item,
      minStock: item.threshold,
      percent: (item.quantity / item.threshold * 100) || 100,
      statusClass: (item.quantity / item.threshold * 100) < 30 ? 'bg-rose-500 text-white' : 
                   (item.quantity / item.threshold * 100) < 70 ? 'bg-orange-500 text-white' : 'bg-emerald-500 text-white',
      progressColor: (item.quantity / item.threshold * 100) < 30 ? 'bg-rose-500' : 
                     (item.quantity / item.threshold * 100) < 70 ? 'bg-orange-500' : 'bg-emerald-500'
    }));
  } catch (error) {
    console.error('Erreur load inventory:', error);
  }
};

onMounted(async () => {
  await Promise.all([loadInventory(), loadDashboard()]);
});

// --- RECHERCHE ---
const searchQuery = ref('');
const filteredInventory = computed(() => {
  if (!searchQuery.value) return inventory.value;
  const query = searchQuery.value.toLowerCase();
  return inventory.value.filter(item => 
    item.name.toLowerCase().includes(query) || item.supplier.toLowerCase().includes(query)
  );
});

// --- GESTION DU MODAL ---
const showModal = ref(false);
const newItem = ref({
  name: '',
  quantity: '',
  minStock: '',
  status: 'Normal',
  supplier: '',
  lastUpdate: new Date().toISOString().split('T')[0],
  unit: ''
});

const resetForm = () => {
  newItem.value = { name: '', quantity: '', minStock: '', status: 'Normal', supplier: '', lastUpdate: new Date().toISOString().split('T')[0], unit: '' };
};

const messageStatus = ref('');
const isLoading = ref(false);

const addItem = async () => {
  if (!newItem.value.name || !newItem.value.quantity || !newItem.value.unit || !newItem.value.minStock) {
    messageStatus.value = 'Veuillez remplir tous les champs obligatoires.';
    return;
  }

  isLoading.value = true;
  messageStatus.value = '';

  try {
    const payload = {
      name: newItem.value.name,
      category: 'aliment',
      quantity: parseFloat(newItem.value.quantity) || 0,
      unit: newItem.value.unit,
      threshold: parseFloat(newItem.value.minStock) || 0
    };

    await api.post('/stock', payload);
    await Promise.all([loadInventory(), loadDashboard()]);
    showModal.value = false;
    resetForm();
    messageStatus.value = 'Article ajouté avec succès!';
    setTimeout(() => messageStatus.value = '', 3000);
  } catch (error) {
    console.error('Erreur ajout:', error);
    messageStatus.value = error.response?.data?.message || 'Erreur lors de l\'ajout.';
    setTimeout(() => messageStatus.value = '', 5000);
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <main class="flex-1 lg:ml-64 p-4 lg:p-8 bg-slate-50 min-h-screen space-y-8">
    
    <header class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-black text-slate-900 tracking-tight">Gestion du Stock</h1>
        <p class="text-slate-500 text-sm font-medium">Suivi en temps réel • SmartFarm</p>
      </div>
      <button @click="showModal = true"
        class="bg-red-900 hover:bg-red-950 text-white px-5 py-3 rounded-2xl text-sm font-bold flex items-center gap-2 transition-all shadow-lg shadow-red-900/20 active:scale-95">
        <Plus class="w-5 h-5" /> Ajouter un Article
      </button>
    </header>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div v-for="stat in stockStats" :key="stat.label" class="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex justify-between items-center">
        <div>
          <p class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{{ stat.label }}</p>
          <p class="text-3xl font-black text-slate-900">{{ stat.value }}</p>
        </div>
        <div :class="['p-3 rounded-2xl bg-slate-50', stat.color]">
            <component :is="stat.icon" class="w-6 h-6" />
        </div>
      </div>
    </div>

    <div class="bg-orange-50 border border-orange-100 p-6 rounded-3xl space-y-4">
      <div class="flex items-center gap-2 text-orange-700 font-black text-xs uppercase tracking-widest">
        <AlertTriangle class="w-5 h-5" /> Alertes de Stock
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div v-for="alert in stockAlerts" :key="alert.name" class="bg-white p-4 rounded-2xl border border-orange-100 flex justify-between items-center shadow-sm">
          <div>
            <h4 class="font-bold text-slate-900 text-sm">{{ alert.name }}</h4>
            <p :class="['text-xs font-bold uppercase mt-1', alert.type === 'critique' ? 'text-rose-500' : 'text-orange-500']">
              {{ alert.message }}
            </p>
          </div>
          <button class="bg-slate-900 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-black transition-colors">
            Commander
          </button>
        </div>
      </div>
    </div>

    <div class="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
      <div class="p-6 border-b border-slate-50 flex flex-col md:flex-row justify-between items-center gap-4">
        <h2 class="font-black text-slate-800 uppercase tracking-tight">Inventaire Global</h2>
        <div class="relative w-full md:w-72">
          <Search class="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input v-model="searchQuery" type="text" placeholder="Rechercher un article..." 
            class="w-full pl-11 pr-4 py-3 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-red-900/20 transition-all outline-none" />
        </div>
      </div>
      
      <div class="overflow-x-auto">
        <table class="w-full text-left text-sm">
          <thead class="bg-slate-50/50 text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em]">
            <tr>
              <th class="px-8 py-4">Article</th>
              <th class="px-6 py-4">Quantité</th>
              <th class="px-6 py-4">Stock Min</th>
              <th class="px-6 py-4">Statut</th>
              <th class="px-6 py-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-50">
            <tr v-for="item in filteredInventory" :key="item.name" class="hover:bg-slate-50/50 transition-colors">
              <td class="px-8 py-5">
                <div class="flex items-center gap-3">
                  <div class="p-2 bg-slate-100 rounded-lg"><Box class="w-4 h-4 text-slate-400" /></div>
                  <div>
                    <p class="font-bold text-slate-800">{{ item.name }}</p>
                    <p class="text-[10px] text-slate-400 font-medium uppercase">{{ item.supplier }}</p>
                  </div>
                </div>
              </td>
              <td class="px-6 py-5 font-black text-slate-900">{{ item.quantity }} <span class="text-slate-400 font-medium text-xs">{{ item.unit }}</span></td>
              <td class="px-6 py-5 text-slate-400 font-bold">{{ item.minStock }} {{ item.unit }}</td>
              <td class="px-6 py-5">
                <div class="w-28">
                  <div :class="['text-[9px] font-black uppercase px-2 py-0.5 rounded-md inline-block mb-1.5 shadow-sm', item.statusClass]">
                    {{ item.status }}
                  </div>
                  <div class="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div :class="['h-full rounded-full transition-all duration-500', item.progressColor]" :style="{ width: item.percent + '%' }"></div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-5 text-center">
                <button class="text-slate-400 hover:text-red-900 font-bold text-xs uppercase transition-colors">Détails</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-if="showModal" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-slate-900/40 backdrop-blur-md transition-opacity" @click="showModal = false"></div>

      <div class="relative w-full max-w-xl bg-white/95 backdrop-blur-xl border border-white shadow-2xl rounded-[2.5rem] overflow-hidden animate-modal">
        
        <div class="bg-red-900 p-8 text-white">
          <div class="flex justify-between items-start">
            <div>
              <h2 class="text-2xl font-black tracking-tight">Nouvel Article</h2>
              <p class="text-red-200 text-xs font-bold uppercase tracking-widest mt-1">Inventaire SmartFarm</p>
            </div>
            <button @click="showModal = false" class="p-2 hover:bg-white/10 rounded-full transition-colors">
              <X class="w-6 h-6" />
            </button>
          </div>
        </div>

        <div class="p-8 grid grid-cols-2 gap-6">
          <div class="col-span-2 space-y-1">
            <label class="label-pro">Nom de l'article</label>
            <input v-model="newItem.name" class="input-pro" placeholder="Ex: Aliment Caprins" />
          </div>

          <div class="space-y-1">
            <label class="label-pro">Quantité</label>
            <input v-model="newItem.quantity" type="number" class="input-pro" placeholder="0.00" />
          </div>

          <div class="space-y-1">
            <label class="label-pro">Unité</label>
            <input v-model="newItem.unit" class="input-pro" placeholder="kg, L, doses..." />
          </div>

          <div class="space-y-1">
            <label class="label-pro">Stock minimum</label>
            <input v-model="newItem.minStock" type="number" class="input-pro" placeholder="Seuil d'alerte" />
          </div>

          <div class="space-y-1">
            <label class="label-pro">Statut initial</label>
            <select v-model="newItem.status" class="input-pro cursor-pointer">
              <option>Normal</option>
              <option>Faible</option>
              <option>Critique</option>
            </select>
          </div>

          <div class="col-span-2 space-y-1">
            <label class="label-pro">Fournisseur</label>
            <input v-model="newItem.supplier" class="input-pro" placeholder="Nom de l'entreprise" />
          </div>
        </div>

        <div v-if="messageStatus" :class="['w-full p-4 rounded-2xl mt-4 font-bold text-sm mb-4', 
          messageStatus.includes('succès') ? 'bg-emerald-100 border border-emerald-200 text-emerald-800' : 
          'bg-rose-100 border border-rose-200 text-rose-800']">
          {{ messageStatus }}
        </div>
        <div class="px-8 py-6 bg-slate-50/50 border-t border-slate-100 flex justify-end gap-4">
          <button @click="showModal = false" class="text-slate-400 hover:text-slate-600 font-bold text-sm">Annuler</button>
          <button @click="addItem" :disabled="isLoading"
            class="bg-red-900 text-white px-8 py-3 rounded-2xl font-bold text-sm shadow-lg shadow-red-900/20 hover:bg-red-950 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed">
            {{ isLoading ? 'Ajout...' : 'Ajouter au Stock' }}
          </button>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>

</style>