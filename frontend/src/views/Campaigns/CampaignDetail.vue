<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import campaignService from '@/services/campaign.js';
import animalService from '@/services/animals.js';
import {
  Target, Users, Beef, UserCircle, Mail, Phone, ChevronLeft, Calendar, ShieldCheck
} from 'lucide-vue-next';

const router = useRouter();
const route = useRoute();

const campaign = ref(null);
const animals = ref([]);
const loading = ref(true);

// Chargement campagne
async function loadCampaign() {
  try {
    loading.value = true;
    const data = await campaignService.getCampaignById(route.params.id);
    campaign.value = data;
  } catch (err) {
    console.error('Erreur chargement campagne:', err);
  } finally {
    loading.value = false;
  }
}

// Chargement animaux liés à la campagne
async function loadAnimals() {
  if (!route.params.id) return;
  try {
    const data = await animalService.getAnimalsByCampaign(route.params.id);
    animals.value = data.map(a => ({
      id: a.identificationNumber,
      name: `${a.species} #${a.identificationNumber}`,
      species: a.species,
      breed: a.breed,
      weight: a.weight ? `${a.weight} kg` : '-',
      status: a.healthStatus,
      typeIcon: a.species.toLowerCase().includes('volaille') ? 'Bird' : 'Beef'
    }));
  } catch (err) {
    console.error('Erreur chargement animaux:', err);
  }
}

onMounted(async () => {
  await loadCampaign();
  await loadAnimals();
});

// Statistiques dynamiques
const animalStats = computed(() => {
  const total = animals.value.length;
  const sain = animals.value.filter(a => a.status === 'sain').length;
  const traitement = animals.value.filter(a => a.status === 'traitement').length;
  const critique = animals.value.filter(a => a.status === 'malade').length;

  return [
    { label: 'Total Cheptel', value: total, icon: Beef, color: 'text-orange-500' },
    { label: 'En Bonne Santé', value: sain, icon: ShieldCheck, color: 'text-emerald-500' },
    { label: 'Sous Traitement', value: traitement, icon: ShieldCheck, color: 'text-blue-500' },
    { label: 'Alertes Critiques', value: critique, icon: ShieldCheck, color: 'text-rose-500' },
  ];
});
</script>

<template>
  <div class="w-full lg:ml-64 bg-slate-50 min-h-screen p-6 md:p-12 font-sans antialiased">
    
    <!-- Header -->
    <div class="max-w-5xl mx-auto flex items-center justify-between mb-8">
      <div class="flex items-center gap-4">
        <button @click="router.back()" class="p-2 hover:bg-white rounded-lg border border-transparent hover:border-slate-200 transition-all text-slate-500">
          <ChevronLeft class="w-5 h-5" />
        </button>
        <div>
          <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Dossier Opérationnel</p>
          <h1 class="text-xl font-bold text-slate-900 leading-none">Détails de la Campagne</h1>
        </div>
      </div>
      <span class="px-3 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-bold uppercase rounded border border-emerald-200">
        Système Actif
      </span>
    </div>

    <!-- Contenu -->
    <div v-if="!loading" class="max-w-5xl mx-auto space-y-8">

      <!-- Info campagne -->
      <div class="bg-white rounded-xl border border-slate-200 shadow-sm p-8">
        <div class="flex items-center gap-6 mb-6">
          <div class="w-16 h-16 bg-slate-900 rounded-xl flex items-center justify-center">
            <Target class="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 class="text-3xl font-black text-slate-900 tracking-tight uppercase">{{ campaign?.name }}</h2>
            <div class="flex items-center gap-4 mt-1 text-slate-500">
              <span class="flex items-center gap-1.5 text-xs font-medium">
                <Users class="w-3.5 h-3.5" /> {{ campaign?.departement?.name || 'Unité non assignée' }}
              </span>
              <span class="w-1 h-1 bg-slate-300 rounded-full"></span>
              <span class="flex items-center gap-1.5 text-xs font-medium">
                <Calendar class="w-3.5 h-3.5" /> Lancée en 2026
              </span>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <!-- Indicateurs -->
          <div class="lg:col-span-7 space-y-6">
            <div class="grid grid-cols-2 gap-6">
              <div class="p-6 bg-slate-50 rounded-xl border border-slate-100 text-center">
                <p class="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Équipe assignée</p>
                <p class="text-4xl font-black text-slate-900">{{ campaign?.agents?.length || 0 }}</p>
              </div>
              <div class="p-6 bg-slate-50 rounded-xl border border-slate-100 text-center">
                <p class="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Cheptel enregistré</p>
                <p class="text-4xl font-black text-slate-900">{{ animals.length }}</p>
              </div>
            </div>

            <div class="mt-4 p-6 border border-dashed border-slate-200 rounded-xl">
              <p class="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Description</p>
              <p class="text-sm text-slate-600 italic">{{ campaign?.description || 'Aucune description fournie.' }}</p>
            </div>
          </div>

          <!-- Responsable -->
          <div class="lg:col-span-5 bg-slate-50 p-6 rounded-xl space-y-6">
            <div class="flex items-center gap-5">
              <div class="w-20 h-20 bg-white rounded-2xl border flex items-center justify-center shadow-sm">
                <UserCircle class="w-12 h-12 text-slate-300" />
              </div>
              <div class="flex-1">
                <h4 class="text-xl font-bold text-slate-900">
                  {{ campaign?.manager?.firstName }} {{ campaign?.manager?.lastName }}
                </h4>
                <p class="text-[10px] font-bold text-red-700 uppercase tracking-widest">Chef de projet</p>
                <div class="space-y-2 mt-2">
                  <a :href="`mailto:${campaign?.manager?.email}`" class="flex items-center gap-2 text-xs text-slate-500 hover:text-slate-900 transition-colors">
                    <Mail class="w-4 h-4 text-slate-400" /> {{ campaign?.manager?.email || 'Non renseigné' }}
                  </a>
                  <a :href="`tel:${campaign?.manager?.phone}`" class="flex items-center gap-2 text-xs text-slate-500 hover:text-slate-900 transition-colors">
                    <Phone class="w-4 h-4 text-slate-400" /> {{ campaign?.manager?.phone || 'Non renseigné' }}
                  </a>
                </div>
              </div>
            </div>

            <button @click="router.back()" class="w-full py-3 bg-white border border-slate-200 text-slate-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all">
              Fermer le dossier
            </button>
          </div>
        </div>
      </div>

      <!-- Table animaux -->
      <div class="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <h3 class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Cheptel & Animaux</h3>
        <div class="overflow-x-auto">
          <table class="w-full text-left text-sm border-collapse">
            <thead class="bg-slate-50/50 text-slate-400 font-semibold text-xs uppercase tracking-wider">
              <tr>
                <th class="px-6 py-3">ID / Nom</th>
                <th class="px-6 py-3">Espèce / Race</th>
                <th class="px-6 py-3">Poids</th>
                <th class="px-6 py-3 text-center">Statut</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-50 font-medium">
              <tr v-for="animal in animals" :key="animal.id" class="hover:bg-slate-50/30 transition-colors">
                <td class="px-6 py-3">{{ animal.id }} - {{ animal.name }}</td>
                <td class="px-6 py-3">{{ animal.species }} / {{ animal.breed }}</td>
                <td class="px-6 py-3">{{ animal.weight }}</td>
                <td class="px-6 py-3 text-center">{{ animal.status }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>

    <div v-else class="max-w-5xl mx-auto flex items-center justify-center py-20">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900"></div>
    </div>

  </div>
</template>

<style scoped>
@import url('https://api.fontshare.com/v2/css?f[]=geist@400,600,700,900&display=swap');
.font-sans { font-family: 'Geist Sans', sans-serif; }
</style>