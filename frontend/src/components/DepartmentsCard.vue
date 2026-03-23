<script setup>
import { Building2, UserCircle, Mail, Phone, ChevronRight, Settings2 } from 'lucide-vue-next';

defineProps({
  dept: { type: Object, required: true }
});
</script>

<template>
  <div class="bg-white rounded-xl border border-slate-100 shadow-sm p-6 flex flex-col transition-all hover:shadow-md">
    <div class="flex justify-between items-start mb-6">
      <div class="p-3 bg-blue-50 text-blue-600 rounded-2xl">
        <Building2 class="w-7 h-7" />
      </div>
      <span class="px-3 py-1 bg-emerald-500 text-white text-[10px] font-bold uppercase rounded-full tracking-wider">
        {{ dept.status }}
      </span>
    </div>

    <div class="mb-6">
      <h3 class="text-2xl font-bold text-slate-900 inline ">{{ dept.name }}</h3>
      <span class="text-xs font-semibold text-slate-400 uppercase tracking-wides px-2 py-1 rounded">
        Département
      </span>
    </div>

    <div class="bg-slate-50/50 rounded-2xl p-4 mb-6">
      <p class="text-[10px] font-bold text-slate-400 uppercase mb-3 tracking-widest">Chef de Département</p>
      <div class="flex items-center gap-4">
        <div class="bg-blue-600 text-white p-2 rounded-full">
          <UserCircle class="w-8 h-8" />
        </div>
        <div>
          <h4 class="font-bold text-slate-900 text-sm">{{ dept.manager.name }}</h4>
          <div class="flex flex-col gap-0.5 mt-1">
             <span class="flex items-center gap-1.5 text-[11px] text-slate-500">
               <Mail class="w-3 h-3" /> {{ dept.manager.email }}
             </span>
             <span class="flex items-center gap-1.5 text-[11px] text-slate-500">
               <Phone class="w-3 h-3" /> {{ dept.manager.phone }}
             </span>
          </div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-2 gap-2 mb-8 text-center border-t border-slate-50 pt-6">
      <div>
        <p class="text-[10px] font-medium text-slate-400 uppercase">Agents</p>
        <p class="text-xl font-bold text-slate-900">{{ dept.stats.agents }}</p>
      </div>
      <div class="border-x border-slate-100 px-2">
        <p class="text-[10px] font-medium text-slate-400 uppercase">Animaux</p>
        <p class="text-xl font-bold text-slate-900">{{ dept.stats.animals }}</p>
      </div>
    </div>

    <div class="grid grid-cols-2 gap-3 mt-auto">
      <button class="py-3 px-4 bg-white border border-slate-200 text-slate-700 text-xs font-bold rounded-xl hover:bg-slate-50 transition-colors flex items-center justify-center gap-2">
        Voir Détails
      </button>
      <button class="py-3 px-4 bg-red-500 text-white text-xs font-bold rounded-xl hover:bg-red-600 transition-colors flex items-center justify-center gap-2">
        Supprimer
      </button>
    </div>
  </div>
</template>