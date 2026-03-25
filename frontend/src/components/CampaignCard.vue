<script setup>
import { computed } from 'vue'
import { CalendarDays, FileText, Settings2 } from 'lucide-vue-next'

// Props pour recevoir la campagne
const props = defineProps({
  campaign: { type: Object, required: true }
})

// Fonctions utilitaires
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
  if (p >= 75) return 'bg-emerald-500'
  if (p >= 50) return 'bg-blue-600'
  return 'bg-orange-500'
})
</script>

<template>
  <div class="group bg-white p-7 border border-slate-100 rounded-[2rem] transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-900/5 hover:-translate-y-1 relative overflow-hidden">
    <div class="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full -mr-16 -mt-16 opacity-50 group-hover:scale-110 transition-transform"></div>

    <div class="relative flex justify-between items-start mb-6 gap-4">
      <div class="flex-1">
        <div class="flex items-center gap-3 mb-3">
          <h3 class="text-xl font-black text-slate-800 tracking-tighter group-hover:text-[#1E8E6E] transition-colors">
            {{ campaign.name }}
          </h3>
          <span class="px-3 py-1 bg-[#1E8E6E]/10 text-[#1E8E6E] text-[10px] font-black uppercase rounded-lg tracking-[0.1em]">
            {{ campaign.departement?.name || 'Unité Libre' }}
          </span>
        </div>

        <div class="flex flex-wrap items-center gap-y-2 gap-x-5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
          <div class="flex items-center gap-1.5">
            <span class="text-slate-300">Responsable:</span>
            <span class="text-slate-600">{{ campaign.manager?.name || 'À définir' }}</span>
          </div>
          <div class="flex items-center gap-1.5">
            <span class="text-slate-300">Staff:</span>
            <span class="text-slate-600">{{ campaign.agents?.length || 0 }}</span>
          </div>
          <div class="flex items-center gap-1.5">
            <span class="text-slate-300">Cheptel:</span>
            <span class="text-[#1E8E6E]">{{ campaign.animals?.length || 0 }} têtes</span>
          </div>
        </div>
      </div>

      <div :class="['px-4 py-2 text-white text-xs font-black rounded-xl shadow-lg transform rotate-3 group-hover:rotate-0 transition-transform tracking-widest', progressionColor]">
        {{ campaign.progression || 0 }}%
      </div>
    </div>

    <div v-if="campaign.budget" class="grid grid-cols-3 gap-3 mb-6 p-4 bg-slate-50 rounded-2xl border border-slate-100">
      <div class="flex flex-col">
        <span class="text-[9px] font-black text-slate-400 uppercase tracking-tighter">Budget Total</span>
        <span class="text-sm font-black text-slate-700">{{ formatFCFA(campaign.budget) }}</span>
      </div>
      <div class="flex flex-col border-x border-slate-200 px-3">
        <span class="text-[9px] font-black text-slate-400 uppercase tracking-tighter">Engagé</span>
        <span class="text-sm font-black text-amber-600">{{ formatFCFA(campaign.budgetDepense || 0) }}</span>
      </div>
      <div class="flex flex-col items-end">
        <span class="text-[9px] font-black text-slate-400 uppercase tracking-tighter">Disponible</span>
        <span class="text-sm font-black text-[#1E8E6E]">{{ formatFCFA(montantRestant) }}</span>
      </div>
    </div>

    <div class="relative w-full h-3 bg-slate-100 rounded-full overflow-hidden mb-6 shadow-inner">
      <div 
        :class="['h-full rounded-full transition-all duration-1000 ease-out relative', progressionColor]" 
        :style="{ width: (campaign.progression || 0) + '%' }"
      >
        <div class="absolute inset-0 bg-white/20 animate-[pulse_2s_infinite]"></div>
      </div>
    </div>

    <div class="flex items-center gap-3">
      <button class="flex-1 px-4 py-3 bg-white text-slate-600 text-[10px] font-black uppercase tracking-widest rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors flex items-center justify-center gap-2">
        <CalendarDays class="w-3.5 h-3.5" /> Planning
      </button>
      <button class="flex-1 px-4 py-3 bg-white text-slate-600 text-[10px] font-black uppercase tracking-widest rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors flex items-center justify-center gap-2">
        <FileText class="w-3.5 h-3.5" /> Dossier
      </button>
      <button class="flex-1 px-4 py-3 bg-[#1E8E6E] text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-lg shadow-emerald-200 hover:bg-[#15634d] transition-all flex items-center justify-center gap-2 transform active:scale-95">
        <Settings2 class="w-3.5 h-3.5 text-emerald-200" /> Gérer
      </button>
    </div>
  </div>
</template>

<style scoped>
/* Petit effet de brillance sur le bouton principal */
button:last-child {
  position: relative;
  overflow: hidden;
}
button:last-child::after {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(45deg, transparent, rgba(255,255,255,0.1), transparent);
  transform: rotate(45deg);
  transition: 0.5s;
}
button:last-child:hover::after {
  left: 100%;
}
</style>