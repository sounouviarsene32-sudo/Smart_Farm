<template>
  <main class="flex-1 lg:ml-64 p-4 lg:p-8 transition-all duration-300 w-full bg-red-50 min-h-screen space-y-8">
    <header class="flex justify-between items-start mb-10">
      <div>
        <h1 class="text-3xl font-extrabold text-slate-950">Cheptel & Animaux</h1>
        <p class="text-slate-500 mt-1">Gestion individuelle et suivi de santé</p>
      </div>
      <button
        class="flex items-center gap-2.5 px-6 py-3 bg-slate-950 text-white rounded-xl text-sm font-semibold shadow-sm transition-hover hover:bg-slate-800">
        <Plus class="w-5 h-5" /> Enregistrer un Animal
      </button>
    </header>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
      <div v-for="stat in animalStats" :key="stat.label"
        class="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between">
        <div class="flex justify-between items-start">
          <span class="text-sm font-medium text-slate-500">{{ stat.label }}</span>
          <div :class="['p-2.5 rounded-xl bg-slate-50', stat.color]">
            <component :is="stat.icon" class="w-5 h-5" />
          </div>
        </div>
        <h3 class="text-3xl font-extrabold text-slate-900 mt-5">{{ stat.value }}</h3>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div class="lg:col-span-2 space-y-6">
        <div class="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <div class="flex flex-wrap items-center justify-between gap-4 mb-6">
            <h2 class="text-xl font-bold text-slate-900">Liste des Animaux</h2>
            <div class="relative flex-1 max-w-sm">
              <Search class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input type="text" placeholder="Rechercher un ID, un nom ou une race..."
                class="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-slate-950 outline-none transition-all" />
            </div>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-left text-sm border-collapse">
              <thead class="bg-slate-50/50 text-slate-400 font-semibold text-xs uppercase tracking-wider">
                <tr>
                  <th class="px-6 py-4">ID / Nom</th>
                  <th class="px-6 py-4">Espèce / Race</th>
                  <th class="px-6 py-4">Poids</th>
                  <th class="px-6 py-4 text-center">Statut</th>
                  <th class="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-50 font-medium">
                <tr v-for="animal in animals" :key="animal.id" class="hover:bg-slate-50/30 transition-colors">
                  <td class="px-6 py-4">
                    <div class="flex items-center gap-3">
                      <div class="p-2 bg-slate-100 rounded-lg text-slate-400">
                        <component :is="animal.typeIcon" class="w-4 h-4" />
                      </div>
                      <div>
                        <div class="font-bold text-slate-900">{{ animal.name }}</div>
                        <div class="text-[10px] text-slate-400 font-mono">{{ animal.id }}</div>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4">
                    <div class="text-slate-900 font-bold text-xs">{{ animal.dept }}</div>
                    <div class="text-[10px] text-slate-400 uppercase tracking-tighter">{{ animal.breed }}</div>
                  </td>
                  <td class="px-6 py-4 text-slate-500">{{ animal.weight }}</td>
                  <td class="px-6 py-4 text-center">
                    <span
                      :class="[getStatusClass(animal.status), 'px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-tight']">
                      {{ animal.status }}
                    </span>
                  </td>
                  <td class="px-6 py-4 text-right">
                    <button class="p-2 text-slate-400 hover:text-slate-950 transition-colors">
                      <ExternalLink class="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div class="space-y-8">
        <div class="bg-slate-950 p-8 rounded-3xl text-white shadow-xl shadow-slate-200">
          <div class="flex items-center gap-3 mb-6">
            <div class="p-2.5 bg-white/10 rounded-xl">
              <QrCode class="w-6 h-6" />
            </div>
            <h3 class="text-xl font-bold">Scanner un Animal</h3>
          </div>
          <p class="text-slate-400 text-sm mb-8 leading-relaxed">Saisissez l'ID manuel ou scannez le tag QR de l'animal
            pour accéder à sa fiche complète.</p>
          <div class="space-y-4">
            <div class="relative">
              <ScanLine class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input v-model="qrInput" type="text" placeholder="Saisir ID Animal..."
                class="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-sm focus:ring-2 focus:ring-white/20 outline-none transition-all placeholder:text-slate-600" />
            </div>
            <button @click="handleScan"
              class="w-full py-4 bg-white text-slate-950 rounded-2xl font-bold text-sm hover:bg-slate-100 transition-all flex items-center justify-center gap-2 shadow-lg shadow-white/5">
              Accéder à la Fiche
            </button>
          </div>
        </div>

        <div class="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <h3 class="font-bold text-slate-900 mb-6 flex items-center gap-2">
            <Activity class="w-4 h-4 text-slate-400" /> Activités Récentes
          </h3>
          <div class="space-y-6">
            <div v-for="i in 3" :key="i" class="flex items-start gap-4">
              <div class="w-2 h-2 rounded-full bg-emerald-500 mt-2"></div>
              <div>
                <p class="text-sm font-bold text-slate-900">Vaccination effectuée</p>
                <p class="text-xs text-slate-400 mt-1">Lot VOL-452 - Vaccination Grippe</p>
                <p class="text-[10px] text-slate-300 mt-1 font-medium uppercase">Il y a 2 heures</p>
              </div>
            </div>
          </div>
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
import { useToast } from 'vue-toastification';

const toast = useToast();
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
    toast.info(`Recherche technique pour l'ID : ${qrInput.value}`);
    qrInput.value = '';
  }
};
</script>