<template>
  <main class="flex-1 lg:ml-64 p-4 lg:p-8 transition-all duration-300 w-full p-8 bg-[#F8F9FA] min-h-screen space-y-8">
    <header class="flex justify-between items-start">
      <div>
        <h1 class="text-3xl font-bold text-slate-900">Gestion des Animaux</h1>
        <p class="text-slate-500 text-sm">Suivi détaillé du cheptel et santé</p>
      </div>
      <button class="bg-slate-950 text-white px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 hover:bg-slate-800 transition-all active:scale-95 shadow-sm">
        <Plus class="w-4 h-4" /> Ajouter un Animal
      </button>
    </header>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div v-for="stat in animalStats" :key="stat.label" class="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex justify-between items-center">
        <div>
          <p class="text-xs font-medium text-slate-400 mb-1.5">{{ stat.label }}</p>
          <p class="text-2xl font-bold text-slate-900">{{ stat.value }}</p>
        </div>
        <component :is="stat.icon" :class="['w-8 h-8', stat.color]" stroke-width="1.5" />
      </div>
    </div>

    <div class="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
      <div class="p-6 border-b border-slate-50 flex justify-between items-center bg-white">
        <h2 class="font-bold text-slate-800">Liste des Animaux</h2>
        <div class="relative w-64">
          <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input type="text" placeholder="Rechercher par ID ou nom..." class="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-slate-950/10" />
        </div>
      </div>
      
      <table class="w-full text-left text-sm">
        <thead class="bg-slate-50/50 text-slate-400 font-bold text-[10px] uppercase tracking-widest border-b border-slate-50">
          <tr>
            <th class="px-6 py-4">Animal / ID</th>
            <th class="px-6 py-4">Département</th>
            <th class="px-6 py-4">Race</th>
            <th class="px-6 py-4 text-center">Poids</th>
            <th class="px-6 py-4">Statut Santé</th>
            <th class="px-6 py-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-50">
          <tr v-for="animal in animals" :key="animal.id" class="hover:bg-slate-50/30 transition-colors">
            <td class="px-6 py-4">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 border border-slate-200 overflow-hidden">
                   <component :is="animal.typeIcon" class="w-5 h-5" />
                </div>
                <div>
                  <div class="font-bold text-slate-900 text-xs">{{ animal.name }}</div>
                  <div class="text-[10px] text-slate-400 font-medium">{{ animal.id }}</div>
                </div>
              </div>
            </td>
            <td class="px-6 py-4">
              <span class="bg-slate-100 px-2.5 py-1 rounded text-[10px] font-bold text-slate-600 border border-slate-200">
                {{ animal.dept }}
              </span>
            </td>
            <td class="px-6 py-4 text-xs text-slate-500">{{ animal.breed }}</td>
            <td class="px-6 py-4 text-center font-bold text-slate-700 text-xs">{{ animal.weight }}</td>
            <td class="px-6 py-4">
              <span :class="[getStatusClass(animal.status), 'px-3 py-1 rounded-full text-[9px] font-extrabold uppercase tracking-tight']">
                {{ animal.status }}
              </span>
            </td>
            <td class="px-6 py-4 text-right">
              <button class="text-slate-300 hover:text-slate-900 transition-colors">
                <ExternalLink class="w-4 h-4" />
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="bg-slate-900 rounded-3xl p-8 text-white shadow-xl shadow-slate-200">
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div class="flex gap-5 items-center">
          <div class="p-4 bg-white/10 rounded-2xl backdrop-blur-md border border-white/10">
            <QrCode class="w-8 h-8 text-blue-400" />
          </div>
          <div>
            <h2 class="text-xl font-bold">Scanner un Animal</h2>
            <p class="text-white/50 text-xs mt-1">Accédez instantanément à l'historique médical par QR Code</p>
          </div>
        </div>
        
        <div class="flex gap-3 w-full md:w-auto">
          <input 
            v-model="qrInput"
            type="text" 
            placeholder="Entrez l'ID technique..." 
            class="flex-1 md:w-64 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
          />
          <button @click="handleScan" class="bg-blue-600 hover:bg-blue-500 px-6 py-3 rounded-xl text-sm font-bold transition-all flex items-center gap-2">
            <ScanLine class="w-4 h-4" /> Scanner
          </button>
        </div>
      </div>
    </div>
</main>
</template>

<script setup>
import { ref } from 'vue';
import { 
  Plus, Search, Beef, Bird, ExternalLink, 
  Activity, ShieldCheck, HeartPulse, AlertCircle,
  QrCode, ScanLine
} from 'lucide-vue-next';

const qrInput = ref('');

const animalStats = [
  { label: 'Total Cheptel', value: '1,250', icon: Beef, color: 'text-orange-500' },
  { label: 'En Bonne Santé', value: '1,198', icon: ShieldCheck, color: 'text-emerald-500' },
  { label: 'Sous Traitement', value: '42', icon: HeartPulse, color: 'text-blue-500' },
  { label: 'Alertes Vitales', value: '10', icon: AlertCircle, color: 'text-rose-500' },
];

const animals = ref([
  { id: 'BOV-2026-001', name: 'Vache #001', dept: 'Bovins', breed: 'Holstein', weight: '620 kg', status: 'Sain', typeIcon: Beef },
  { id: 'VOL-2026-452', name: 'Poulet Lot A4', dept: 'Volaille', breed: 'Poulet de chair', weight: '2.5 kg', status: 'Traitement', typeIcon: Bird },
  { id: 'BOV-2026-045', name: 'Taureau Alpha', dept: 'Bovins', breed: 'Charolais', weight: '850 kg', status: 'Critique', typeIcon: Beef },
  { id: 'OVN-2026-012', name: 'Brebis #012', dept: 'Ovins', breed: 'Mérinos', weight: '55 kg', status: 'Sain', typeIcon: Beef },
]);

const getStatusClass = (status) => {
  switch (status) {
    case 'Sain': return 'bg-emerald-500 text-white';
    case 'Traitement': return 'bg-blue-600 text-white';
    case 'Critique': return 'bg-rose-500 text-white';
    default: return 'bg-slate-400 text-white';
  }
};

const handleScan = () => {
  if (qrInput.value) {
    alert(`Recherche technique pour l'ID : ${qrInput.value}`);
    qrInput.value = '';
  }
};
</script>