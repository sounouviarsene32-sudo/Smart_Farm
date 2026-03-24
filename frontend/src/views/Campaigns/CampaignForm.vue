<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import campaignService from '@/services/campaign.js';
import departementService from '@/services/departement.js';

const router = useRouter();
const route = useRoute();
const campaignId = route.params.id || null;

const loading = ref(false);
const submitting = ref(false);
const error = ref(null);
const success = ref(null);

const form = reactive({
  departement: '',
  name: '',
  description: '',
  startDate: '',
  endDate: '',
  status: 'planifié',
  budget: ''
});

const departements = ref([]);

async function loadDepartements() {
  try {
    const data = await departementService.getDepartements();
    departements.value = data;
  } catch (err) {
    console.error('Erreur chargement départements:', err);
  }
}

async function loadCampaign() {
  if (!campaignId) return;
  loading.value = true;
  try {
    const data = await campaignService.getCampaignById(campaignId);
    form.departement = data.departement?._id || '';
    form.name = data.name;
    form.description = data.description || '';
    form.startDate = data.startDate ? data.startDate.split('T')[0] : '';
    form.endDate = data.endDate ? data.endDate.split('T')[0] : '';
    form.status = data.status || 'planifié';
    form.budget = data.budget || '';
  } catch (err) {
    console.error('Erreur chargement campagne:', err);
  } finally {
    loading.value = false;
  }
}

async function submitForm() {
  submitting.value = true;
  error.value = null;
  success.value = null;

  try {
    const payload = {
      departement: form.departement,
      name: form.name,
      description: form.description,
      startDate: form.startDate,
      endDate: form.endDate || null,
      status: form.status,
      budget: form.budget ? Number(form.budget) : 0
    };

    if (campaignId) {
      await campaignService.updateCampaign(campaignId, payload);
      success.value = 'Campagne mise à jour avec succès !';
    } else {
      await campaignService.createCampaign(payload);
      success.value = 'Campagne créée avec succès !';
    }
    
    setTimeout(() => router.back(), 1500);
  } catch (err) {
    console.error(err);
    error.value = 'Une erreur est survenue lors de la sauvegarde.';
  } finally {
    submitting.value = false;
  }
}

onMounted(() => {
  loadDepartements();
  loadCampaign();
});
</script>

<template>
  <div class="max-w-4xl mx-auto bg-[#fcfcfc] rounded-3xl shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden tracking-tight">
    <div class="relative bg-white border-b border-slate-100 p-8">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-extrabold text-slate-900 tracking-tighter">
            {{ campaignId ? 'Édition Campagne' : 'Nouvelle Campagne' }}
          </h1>
          <p class="text-slate-500 mt-1 font-medium">Gestion et planification des ressources SmartFarm</p>
        </div>
        <div class="h-14 w-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-[#1E8E6E]">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04 Pel m6 10H6.618m6 10H6.618" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707" />
          </svg>
        </div>
      </div>
    </div>

    <div v-if="loading" class="flex flex-col items-center justify-center py-24 space-y-4">
      <div class="animate-spin rounded-full h-12 w-12 border-[3px] border-slate-100 border-t-[#1E8E6E]"></div>
      <p class="text-slate-400 font-semibold uppercase text-xs tracking-[0.2em]">Synchronisation</p>
    </div>

    <form v-else @submit.prevent="submitForm" class="p-10 space-y-8">
      
      <section class="space-y-6">
        <div class="flex items-center gap-4 mb-2">
          <span class="h-px flex-1 bg-slate-100"></span>
          <span class="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Informations Générales</span>
          <span class="h-px flex-1 bg-slate-100"></span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div class="md:col-span-2 group">
            <label class="block text-sm font-bold text-slate-700 mb-2 ml-1">Nom de l'opération</label>
            <input 
              v-model="form.name" 
              type="text" 
              placeholder="Saisissez le titre de la campagne..."
              class="w-full bg-white border-2 border-slate-100 focus:border-[#1E8E6E] focus:ring-0 rounded-2xl px-5 py-4 transition-all outline-none font-medium text-slate-800" 
              required 
            />
          </div>

          <div class="space-y-2">
            <label class="block text-sm font-bold text-slate-700 ml-1">Département</label>
            <select 
              v-model="form.departement" 
              class="w-full bg-white border-2 border-slate-100 focus:border-[#1E8E6E] rounded-2xl px-5 py-4 font-medium text-slate-800 outline-none appearance-none cursor-pointer"
              required
            >
              <option value="" disabled>Sélectionner une unité</option>
              <option v-for="d in departements" :key="d._id" :value="d._id">{{ d.name }}</option>
            </select>
          </div>

          <div class="space-y-2">
            <label class="block text-sm font-bold text-slate-700 ml-1">État actuel</label>
            <select 
              v-model="form.status" 
              class="w-full bg-white border-2 border-slate-100 focus:border-[#1E8E6E] rounded-2xl px-5 py-4 font-bold text-[#1E8E6E] outline-none appearance-none cursor-pointer"
            >
              <option value="planifié">Planifié</option>
              <option value="actif">Actif</option>
              <option value="terminé">Terminé</option>
            </select>
          </div>
        </div>

        <div class="group">
          <label class="block text-sm font-bold text-slate-700 mb-2 ml-1">Objectifs & Description</label>
          <textarea 
            v-model="form.description" 
            class="w-full bg-white border-2 border-slate-100 focus:border-[#1E8E6E] rounded-2xl px-5 py-4 border outline-none resize-none font-medium" 
            rows="4"
          ></textarea>
        </div>
      </section>

      <section class="bg-white border border-slate-100 p-8 rounded-[2.5rem] shadow-sm space-y-6">
        <div class="flex items-center gap-4 mb-2">
          <span class="text-[10px] font-black uppercase tracking-[0.3em] text-amber-500">Planning & Finance</span>
          <span class="h-px flex-1 bg-amber-50"></span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="space-y-2">
            <label class="block text-xs font-black text-slate-400 uppercase ml-1">Date d'ouverture</label>
            <input v-model="form.startDate" type="date" class="w-full bg-slate-50 border-none focus:ring-2 focus:ring-[#1E8E6E] rounded-xl px-4 py-3 font-semibold text-slate-700 outline-none" required />
          </div>
          <div class="space-y-2">
            <label class="block text-xs font-black text-slate-400 uppercase ml-1">Clôture prévue</label>
            <input v-model="form.endDate" type="date" class="w-full bg-slate-50 border-none focus:ring-2 focus:ring-[#1E8E6E] rounded-xl px-4 py-3 font-semibold text-slate-700 outline-none" />
          </div>
          <div class="space-y-2">
            <label class="block text-xs font-black text-amber-600 uppercase ml-1">Allocation (FCFA)</label>
            <input 
              v-model="form.budget" 
              type="number" 
              placeholder="0"
              class="w-full bg-amber-50/50 border-none focus:ring-2 focus:ring-amber-500 rounded-xl px-4 py-3 font-black text-amber-700 outline-none" 
            />
          </div>
        </div>
      </section>

      <div class="flex items-center justify-between pt-4">
        <div class="flex-1 mr-4">
          <transition 
            enter-active-class="transition duration-300 ease-out"
            enter-from-class="opacity-0 -translate-x-4"
            enter-to-class="opacity-100 translate-x-0"
            mode="out-in"
          >
            <p 
              v-if="error || success" 
              :key="error ? 'err' : 'succ'"
              :class="error ? 'text-red-900 bg-red-50 border-red-100' : 'text-emerald-900 bg-emerald-50 border-emerald-100'"
              class="inline-flex items-center px-4 py-2 rounded-full border text-[13px] font-bold"
            >
              <span class="mr-2">{{ error ? '✕' : '✓' }}</span>
              {{ error || success }}
            </p>
          </transition>
        </div>

        <div class="flex gap-4">
          <button 
            type="button" 
            @click="router.back()" 
            class="px-8 py-4 text-slate-400 hover:text-slate-600 font-bold transition-all text-sm uppercase tracking-widest"
          >
            Retour
          </button>
          <button 
            type="submit" 
            class="px-10 py-4 bg-[#1E8E6E] hover:bg-[#15634d] text-white rounded-2xl font-black shadow-xl shadow-emerald-200 transition-all transform active:scale-95 disabled:opacity-50 text-sm uppercase tracking-widest flex items-center gap-3"
            :disabled="submitting"
          >
            <span v-if="submitting" class="h-4 w-4 border-2 border-white/20 border-t-white animate-spin rounded-full"></span>
            {{ submitting ? 'Traitement' : (campaignId ? 'Mettre à jour' : 'Confirmer') }}
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<style scoped>
/* Suppression des flèches sur les inputs number */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>