<script setup>
import { Mail, Phone, CalendarDays, UserCircle, Edit2, Trash2, PawPrint } from 'lucide-vue-next';

// Définition des props pour recevoir les données du chef
defineProps({
  chef: {
    type: Object,
    required: true
  }
});

// Événements émis pour les actions de modification et suppression
const emit = defineEmits(['edit', 'delete']);

// Fonction utilitaire pour gérer les couleurs de performance
const getPerformanceClass = (perf) => {
  if (perf === 'Excellent') return 'bg-emerald-50 text-emerald-700 border-emerald-100';
  if (perf === 'Très Bon') return 'bg-blue-50 text-blue-700 border-blue-100';
  return 'bg-slate-50 text-slate-700 border-slate-100';
};
</script>

<template>
  <div class="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between transition-hover hover:shadow-lg">
    
    <div class="flex justify-between items-start gap-4 mb-5">
      <div class="flex items-center gap-4">
        <UserCircle class="w-14 h-14 text-slate-300" stroke-width="1" />
        <div>
          <h3 class="text-xl font-bold text-slate-950">{{ chef.nom }}</h3>
          <span class="text-xs font-medium text-slate-500 uppercase tracking-wider">
            {{ chef.departement }}
          </span>
        </div>
      </div>
      <span :class="['px-3 py-1 text-xs font-bold rounded-full border', getPerformanceClass(chef.performance)]">
        {{ chef.performance }}
      </span>
    </div>

    <div class="space-y-3 mb-6">
      <div class="flex items-center gap-3 text-sm text-slate-600">
        <Mail class="w-4 h-4 text-slate-400" />
        {{ chef.email }}
      </div>
      <div class="flex items-center gap-3 text-sm text-slate-600">
        <Phone class="w-4 h-4 text-slate-400" />
        {{ chef.telephone }}
      </div>
      <div class="flex items-center gap-3 text-sm text-slate-600">
        <CalendarDays class="w-4 h-4 text-slate-400" />
        Depuis le {{ chef.dateArrivee }}
      </div>
    </div>

    <div class="border-t border-slate-100 mb-6"></div>

    <div class="grid grid-cols-2 gap-4 text-center mb-6">
      <div class="border-r border-slate-100 pr-4">
        <p class="text-xs text-slate-500 font-medium">Agents</p>
        <p class="text-3xl font-bold text-slate-900">{{ chef.totalAgents }}</p>
      </div>
      <div class="flex flex-col items-center">
        <p class="text-xs text-slate-500 font-medium flex items-center gap-1">
          Animaux <PawPrint class="w-3.5 h-3.5 text-slate-400" />
        </p>
        <p class="text-3xl font-bold text-slate-900">{{ chef.totalAnimaux }}</p>
      </div>
    </div>

    <div class="flex items-center gap-2 mt-auto">
      <button 
        @click="emit('edit', chef.id)"
        class="flex-1 flex items-center justify-center gap-2 py-2.5 bg-slate-50 text-slate-700 text-sm font-semibold rounded-xl border border-slate-200 transition-colors hover:bg-slate-100"
      >
        <Edit2 class="w-4 h-4" /> Modifier
      </button>
      <button 
        @click="emit('delete', chef.id)"
        class="p-3 bg-rose-50 text-rose-600 rounded-xl border border-rose-100 transition-colors hover:bg-rose-100"
      >
        <Trash2 class="w-4 h-4" />
      </button>
    </div>

  </div>
</template>