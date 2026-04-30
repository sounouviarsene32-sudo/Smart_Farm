<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import campaignService from '@/services/campaign.js'
import departementService from '@/services/departement.js'
const loading = ref(false);

const props = defineProps({
  campaignId: {
    type: String,
    default: false,
  },
  departementId: {
    type: String,
    default: null,
  },
})

const emit = defineEmits(['close', 'created'])

const route = useRoute()

const submitting = ref(false)

const form = reactive({
  departement: '',
  name: '',
  description: '',
  startDate: '',
  endDate: '',
  status: 'planifié',
  budget: '',
  manager: null,
  agents: [],
})

const departements = ref([])

async function loadDepartements() {
  try {
    const data = await departementService.getDepartements()
    departements.value = data
  } catch (err) {
    console.error('Erreur chargement départements:', err)
  }
}

async function loadCampaign() {
  if (!props.campaignId) return;
  loading.value = true;
  try {
    const data = await campaignService.getCampaignById(props.campaignId);
    form.departement = Array.isArray(data.departement) && data.departement.length > 0
      ? (data.departement[0]._id || data.departement[0].id || data.departement[0])
      : '';
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

onMounted(async () => {
  await loadDepartements()
  await loadCampaign();
  // SI on est en mode création (pas de campaignId) ET qu'on a reçu un departementId
  if (!props.campaignId && props.departementId) {
    form.departement = props.departementId
  }
})

const handleSubmit = async () => {
  submitting.value = true
  try {
    if (props.campaignId) {
      await campaignService.updateCampaign(props.campaignId, form)
      emit('updated')
    } else {
      const newCampaign = await campaignService.createCampaign(form)
      emit('created', newCampaign) // On émet 'created' comme attendu par le parent
    }
    emit('close')
  } catch (err) {
    // ... gestion erreur ...
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div
    class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 tracking-tight"
  >
    <div
      class="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden border border-slate-200 flex flex-col max-h-[95vh]"
    >
      <div
        class="px-8 py-6 bg-white border-b border-slate-100 flex items-center justify-between shrink-0"
      >
        <div>
          <div class="flex items-center gap-2 mb-1">
            <span class="relative flex h-2 w-2">
              <span
                class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"
              ></span>
              <span class="relative inline-flex rounded-full h-2 w-2 bg-[#1E8E6E]"></span>
            </span>
            <span class="text-[10px] font-black uppercase tracking-[0.2em] text-[#1E8E6E]"
              >SmartFarm Protocol</span
            >
          </div>
          <h2 class="text-2xl font-extrabold text-slate-900 tracking-tighter uppercase">
            Initialiser Campagne
          </h2>
        </div>
        <button
          @click="$emit('close')"
          class="group p-2 rounded-xl bg-slate-50 hover:bg-slate-100 transition-all"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5 text-slate-400 group-hover:text-red-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <form @submit.prevent="handleSubmit" class="p-8 space-y-6 overflow-y-auto custom-scrollbar">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="md:col-span-2">
            <label class="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider"
              >Titre de l'opération</label
            >
            <input
              v-model="form.name"
              type="text"
              placeholder="Ex: Campagne Semis 2026"
              class="w-full bg-slate-50 border border-slate-200 focus:border-[#1E8E6E] focus:bg-white rounded-xl px-4 py-3 text-sm font-semibold text-slate-800 outline-none transition-all shadow-sm"
              required
            />
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">
              Unité / Département
            </label>
            <select
              v-model="form.departement"
              required
              :disabled="!!props.departementId"
              class="w-full bg-slate-50 border border-slate-200 focus:border-[#1E8E6E] focus:bg-white rounded-xl px-4 py-3 text-sm font-semibold text-slate-800 outline-none transition-all disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <option value="" disabled>Sélectionner une unité</option>
              <option v-for="d in departements" :key="d.id || d._id" :value="d.id || d._id">
                {{ d.name }}
              </option>
            </select>
            <p v-if="props.departementId" class="text-[10px] text-emerald-600 mt-1 font-medium">
              ✓ Unité sélectionnée automatiquement
            </p>
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider"
              >Statut</label
            >
            <select
              v-model="form.status"
              class="w-full bg-slate-50 border border-slate-200 focus:border-[#1E8E6E] focus:bg-white rounded-xl px-4 py-3 text-sm font-bold text-[#1E8E6E] outline-none shadow-sm appearance-none cursor-pointer"
            >
              <option value="planifié">Planifié</option>
              <option value="actif">Actif</option>
              <option value="terminé">Terminé</option>
            </select>
          </div>
        </div>

        <div
          class="p-6 bg-slate-50/80 rounded-2xl border border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-6 shadow-inner"
        >
          <div>
            <label class="block text-[10px] font-black text-slate-400 uppercase mb-2"
              >Début de mission</label
            >
            <input
              v-model="form.startDate"
              type="date"
              class="w-full bg-white border border-slate-200 rounded-lg px-3 py-2.5 text-xs font-bold text-slate-700 outline-none focus:ring-1 focus:ring-[#1E8E6E]"
              required
            />
          </div>
          <div>
            <label class="block text-[10px] font-black text-slate-400 uppercase mb-2"
              >Clôture prévue</label
            >
            <input
              v-model="form.endDate"
              type="date"
              class="w-full bg-white border border-slate-200 rounded-lg px-3 py-2.5 text-xs font-bold text-slate-700 outline-none focus:ring-1 focus:ring-[#1E8E6E]"
            />
          </div>
          <div>
            <label class="block text-[10px] font-black text-amber-600 uppercase mb-2"
              >Budget (FCFA)</label
            >
            <input
              v-model="form.budget"
              type="number"
              placeholder="0"
              class="w-full bg-white border border-slate-200 focus:border-amber-500 rounded-lg px-3 py-2.5 text-xs font-black text-amber-700 outline-none"
            />
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6"></div>

        <div>
          <label class="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider"
            >Notes stratégiques</label
          >
          <textarea
            v-model="form.description"
            rows="3"
            placeholder="Description de la mission..."
            class="w-full bg-slate-50 border border-slate-200 focus:border-[#1E8E6E] focus:bg-white rounded-xl px-4 py-3 text-sm font-medium text-slate-700 outline-none resize-none transition-all"
          ></textarea>
        </div>

        <div class="flex items-center justify-end gap-4 pt-4 border-t border-slate-50 shrink-0">
          <button
            type="button"
            @click="$emit('close')"
            class="text-xs font-bold text-slate-400 hover:text-slate-600 px-4 py-2 uppercase tracking-widest transition-colors"
          >
            Annuler
          </button>
          <button
            type="submit"
            class="bg-[#1E8E6E] hover:bg-[#15634d] text-white px-10 py-4 rounded-xl font-black text-xs uppercase tracking-[0.15em] shadow-lg shadow-emerald-900/10 transition-all active:scale-95 transform"
          >
            Confirmer l'ouverture
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
/* Scrollbar ultra-fine et discrète sans @apply */
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #e2e8f0;
  border-radius: 10px;
}

/* Suppression des flèches sur les inputs number */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>
