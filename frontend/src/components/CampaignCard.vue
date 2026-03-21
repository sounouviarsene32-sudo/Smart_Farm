<script setup>
import { computed } from 'vue';
import { CalendarDays, FileText, Settings2 } from 'lucide-vue-next';

// Définition des props pour recevoir les données de la campagne
const props = defineProps({
  campaign: {
    type: Object,
    required: true
  }
});

// Fonctions utilitaires pour le formatage des montants
const formatFCFA = (amount) => {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF', minimumFractionDigits: 0 }).format(amount).replace('XOF', 'FCFA');
};

// Calcul du montant restant
const montantRestant = computed(() => {
  return props.campaign.budgetTotal - props.campaign.budgetDepense;
});

// Couleur du badge de progression principale
const progressionColor = computed(() => {
  if (props.campaign.progression >= 75) return 'bg-emerald-500';
  if (props.campaign.progression >= 50) return 'bg-blue-600';
  return 'bg-orange-500';
});
</script>

<template>
  <div class="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm transition-hover hover:shadow-md">
    
    <div class="flex justify-between items-start gap-4 mb-5">
      <div>
        <div class="flex items-center gap-2.5">
          <h3 class="text-xl font-bold text-slate-950">{{ campaign.titre }}</h3>
          <span class="px-3 py-1 bg-slate-100 text-slate-600 text-[10px] font-bold uppercase rounded-full border border-slate-200 tracking-tight">
            {{ campaign.departement }}
          </span>
        </div>
        <div class="text-xs text-slate-500 mt-2 flex items-center gap-3">
          <span>Budget: <span class="font-semibold text-slate-700">{{ formatFCFA(campaign.budgetTotal) }}</span></span>
          <span class="text-slate-300">|</span>
          <span>Dépensé: <span class="font-semibold text-slate-700">{{ formatFCFA(campaign.budgetDepense) }}</span></span>
          <span class="text-slate-300">|</span>
          <span class="text-emerald-500 font-semibold">Restant: {{ formatFCFA(montantRestant) }}</span>
        </div>
      </div>
      <span :class="['px-3 py-1.5 text-white text-[10px] font-bold rounded-full uppercase tracking-tight', progressionColor]">
        {{ campaign.progression }}%
      </span>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 mb-6">
      
      <div>
        <div class="flex justify-between items-center text-xs text-slate-400 mb-1.5">
          <span>Progression</span>
          <span class="font-bold text-slate-700">{{ campaign.progression }}%</span>
        </div>
        <div class="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
          <div :class="['h-full rounded-full', progressionColor]" :style="{ width: campaign.progression + '%' }"></div>
        </div>
      </div>

      <div>
        <div class="flex justify-between items-center text-xs text-slate-400 mb-1.5">
          <span>Utilisation Budget</span>
          <span class="font-bold text-slate-700">{{ campaign.utilisationBudget }}%</span>
        </div>
        <div class="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
          <div class="h-full bg-orange-500 rounded-full" :style="{ width: campaign.utilisationBudget + '%' }"></div>
        </div>
      </div>

    </div>

    <div class="border-t border-slate-50 mb-6"></div>

    <div class="flex items-center gap-2.5">
      <button class="px-4 py-2.5 bg-slate-50 text-slate-700 text-xs font-bold rounded-xl border border-slate-200 transition-colors hover:bg-slate-100 flex items-center gap-2">
        <CalendarDays class="w-4 h-4" /> Planning
      </button>
      <button class="px-4 py-2.5 bg-white border border-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors hover:bg-slate-50 flex items-center gap-2">
        <FileText class="w-4 h-4" /> Détails
      </button>
      <button class="px-4 py-2.5 bg-slate-950 text-white text-xs font-bold rounded-xl transition-colors hover:bg-slate-800 flex items-center gap-2">
        <Settings2 class="w-4 h-4" /> Gérer
      </button>
    </div>

  </div>
</template>