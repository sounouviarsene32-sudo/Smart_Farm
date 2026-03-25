<script setup>
import { computed } from 'vue'
import { CalendarDays, FileText, Settings2 } from 'lucide-vue-next'
import { useRouter } from 'vue-router'

const router = useRouter()
const props = defineProps({
  campaign: { type: Object, required: true },
})

// Formatage FCFA
const formatFCFA = (amount) =>
  new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF', minimumFractionDigits: 0 })
    .format(amount)
    .replace('XOF', 'FCFA')

// Montant restant
const montantRestant = computed(() => {
  return (props.campaign.budget || 0) - (props.campaign.budgetDepense || 0)
})

// Couleur de progression
const progressionColor = computed(() => {
  const p = props.campaign.progression || 0
  if (p >= 75) return 'bg-[#750505]' // Bordeaux complet
  if (p >= 50) return 'bg-slate-700' // Gris neutre
  return 'bg-slate-400' // Gris clair
})

// Redirection vers le détail de la campagne
const goToDetails = () => {
  router.push({
    name: 'campaigns-detail',
    params: { id: props.campaign._id },
  })
}
</script>

<template>
  <div
    class="group bg-white p-8 border border-slate-200 rounded-3xl transition-all duration-500 hover:shadow-[0_30px_60px_-15px_rgba(117,5,5,0.1)] hover:-translate-y-1 relative overflow-hidden font-geist"
  >
    <div class="absolute top-0 right-0 w-24 h-24 bg-slate-50 rounded-full -mr-12 -mt-12 transition-transform group-hover:scale-150 duration-700"></div>

    <div class="relative flex justify-between items-start mb-8 gap-4">
      <div class="flex-1">
        <div class="flex items-center gap-3 mb-4">
          <h3 class="text-2xl font-black text-slate-900 tracking-tighter uppercase transition-colors group-hover:text-[#750505]">
            {{ campaign.name }}
          </h3>
          <span class="px-3 py-1 bg-slate-100 text-slate-500 text-[9px] font-black uppercase rounded-md tracking-[0.15em] border border-slate-200">
            {{ campaign.departement?.name || 'Standard' }}
          </span>
        </div>

        <div class="flex flex-wrap items-center gap-x-6 gap-y-2">
          <div class="flex flex-col">
            <span class="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Responsable</span>
            <span class="text-xs font-black text-slate-700 italic">{{ campaign.manager?.firstName || 'Staff' }}</span>
          </div>
          <div class="w-px h-6 bg-slate-100 hidden md:block"></div>
          <div class="flex flex-col">
            <span class="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Cheptel</span>
            <span class="text-xs font-black text-[#750505]">{{ campaign.animalsCount || 0 }} Têtes</span>
          </div>
        </div>
      </div>

      <div
        :class="[
          'px-5 py-2 text-white text-xs font-black rounded-xl shadow-xl transition-all duration-500 tracking-widest',
          progressionColor,
        ]"
      >
        {{ campaign.progression || 0 }}%
      </div>
    </div>

    <div v-if="campaign.budget" class="grid grid-cols-3 gap-1 mb-8">
      <div class="flex flex-col p-4 bg-slate-50 rounded-l-2xl border-l border-y border-slate-100">
        <span class="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Alloué</span>
        <span class="text-[11px] font-black text-slate-900">{{ formatFCFA(campaign.budget) }}</span>
      </div>
      <div class="flex flex-col p-4 bg-slate-50 border-y border-slate-100">
        <span class="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Dépensé</span>
        <span class="text-[11px] font-black text-slate-600">{{ formatFCFA(campaign.budgetDepense || 0) }}</span>
      </div>
      <div class="flex flex-col p-4 bg-[#750505]/5 rounded-r-2xl border-r border-y border-[#750505]/10 items-end text-right">
        <span class="text-[8px] font-black text-[#750505] uppercase tracking-widest mb-1">Disponible</span>
        <span class="text-[11px] font-black text-[#750505]">{{ formatFCFA(montantRestant) }}</span>
      </div>
    </div>

    <div class="relative w-full h-1.5 bg-slate-100 rounded-full overflow-hidden mb-8 shadow-inner">
      <div
        :class="['h-full rounded-full transition-all duration-1000 ease-in-out', progressionColor]"
        :style="{ width: (campaign.progression || 0) + '%' }"
      ></div>
    </div>

    <div class="flex items-center gap-3">
      <button
        class="flex-1 px-4 py-4 bg-white text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] rounded-xl border border-slate-200 hover:bg-slate-50 hover:text-slate-900 transition-all flex items-center justify-center gap-2"
      >
        <CalendarDays class="w-3.5 h-3.5" /> Planning
      </button>
      <button
        @click="goToDetails"
        class="flex-1 px-4 py-4 bg-white text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] rounded-xl border border-slate-200 hover:bg-slate-50 hover:text-slate-900 transition-all flex items-center justify-center gap-2"
      >
        <FileText class="w-3.5 h-3.5" /> Dossier
      </button>
      <button
        class="flex-1 px-4 py-4 bg-blue-600 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-xl shadow-lg hover:bg-blue-500 transition-all flex items-center justify-center gap-2 transform active:scale-95"
      >
        <Settings2 class="w-3.5 h-3.5 text-red-300" /> Gérer
      </button>
    </div>
  </div>
</template>

<style scoped>
@import url('https://api.fontshare.com/v2/css?f[]=geist@400,700,900&display=swap');

.font-geist {
  font-family: 'Geist Sans', sans-serif;
}

button:last-child {
  position: relative;
  overflow: hidden;
}

button:last-child::after {
  content: '';
  position: absolute;
  top: -50%;
  left: -100%;
  width: 100%;
  height: 200%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transform: rotate(45deg);
  transition: 0.8s;
}

button:last-child:hover::after {
  left: 100%;
}
</style>