<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import campaignService from '@/services/campaign.js';
import {
  Users, Beef, UserCircle, Mail, Phone, ChevronLeft, Target
} from 'lucide-vue-next';

const router = useRouter();
const route = useRoute();
const campaignId = route.params.id;

const dept = ref({
  name: '',
  agents: 0,
  animals: 0,
  chef: '',
  email: '',
  phone: '',
  perf: '0%',
  revenus: 0
});

const loading = ref(true);

async function loadCampaign() {
  try {
    loading.value = true;
    const data = await campaignService.getCampaignById(campaignId);
    dept.value = {
      name: data.titre,
      agents: data.stats?.agents || 0,
      animals: data.stats?.animals || 0,
      chef: data.manager?.name || 'Non assigné',
      email: data.manager?.email || '',
      phone: data.manager?.phone || '',
      perf: data.stats?.perf || '0%',
      revenus: data.stats?.revenus || 0
    };
  } catch (err) {
    console.error('Erreur chargement campagne:', err);
  } finally {
    loading.value = false;
  }
}

onMounted(() => loadCampaign());
</script>

<template>
  <div class="w-full lg:ml-64 bg-red-50 min-h-screen flex flex-col items-center justify-center ">
    <h1 class="text-2xl font-bold text-slate-900 py-10">Détail de la Campagne</h1>
    <div class="w-full max-w-4xl bg-white rounded-xl border border-slate-100 p-10">
      
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        
        <div class="space-y-8">
          <div>
            <div class="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center mb-6 border border-green-100">
              <Target class="w-7 h-7 text-green-500" />
            </div>
            <h3 class="text-lg font-black text-slate-700 "><span class="uppercase text-xl text-red-600 tracking-tight" >Campagne :</span> {{ dept.name }}</h3>
            <span class="inline-block mt-2 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
              
            </span>
          </div>

          <div class="grid grid-cols-2 gap-6">
            <div class="bg-slate-50/50 p-5 rounded-2xl border border-slate-100">
              <div class="flex items-center gap-2 mb-2">
                <Users class="w-4 h-4 text-slate-400" />
                <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Agents</p>
              </div>
              <p class="text-3xl font-black text-slate-900">{{ dept.agents }}</p>
            </div>
            <div class="bg-slate-50/50 p-5 rounded-2xl border border-slate-100">
              <div class="flex items-center gap-2 mb-2">
                <Beef class="w-4 h-4 text-slate-400" />
                <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Animaux</p>
              </div>
              <p class="text-3xl font-black text-slate-900">{{ dept.animals }}</p>
            </div>
          </div>
        </div>

        <div class="bg-green-500 p-8 text-white shadow-2xl shadow-slate-300">
          <p class="text-[10px] font-bold text-white/40 uppercase mb-6 tracking-[0.2em]">Chef de Campagne</p>
          
          <div class="flex items-center gap-5 mb-8">
            <div class="w-16 h-16 bg-red-500 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-900/20">
              <UserCircle class="w-10 h-10 text-white" />
            </div>
            <div>
              <h4 class="font-extrabold text-xl text-white">{{ dept.chef }}</h4>
              <div class="flex flex-col gap-1 mt-2">
                <span class="flex items-center gap-2 text-xs text-white/60">
                  <Mail class="w-3.5 h-3.5 text-blue-400" /> {{ dept.email }}
                </span>
                <span class="flex items-center gap-2 text-xs text-white/60">
                  <Phone class="w-3.5 h-3.5 text-blue-400" /> {{ dept.phone }}
                </span>
              </div>
            </div>
          </div>

          <button
            @click="router.back()"
            class="w-full py-4 bg-white/10 hover:bg-white/20 border border-white/10 text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 active:scale-95"
          >
            <ChevronLeft class="w-4 h-4" /> Retour
          </button>
        </div>

      </div>
    </div>
  </div>
</template>

<style scoped>
/* Petit ajout pour l'animation de chargement */
.animate-fade-in {
  animation: fadeIn 0.5s ease-out;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>