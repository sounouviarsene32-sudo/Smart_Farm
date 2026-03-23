<script setup>
defineProps({
  title: String,
  value: String,
  subText: String,
  trend: String,
  trendIsUp: Boolean, // true pour flèche verte vers le haut, false pour rouge vers le bas
  colorClass: String, // ex: 'text-emerald-500', 'text-blue-500', etc.
  icon: Object // Composant Lucide ou SVG
})
</script>

<template>
  <div class="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
    <div class="flex justify-between items-start">
      <span class="text-sm font-medium text-slate-500">{{ title }}</span>
      <div :class="[colorClass, 'p-2 rounded-lg bg-opacity-10']">
         <component :is="icon" class="w-5 h-5" />
      </div>
    </div>
    
    <div class="mt-4">
      <h3 class="text-2xl font-bold text-slate-800">{{ value }}</h3>
      <div class="flex items-center gap-1 mt-1">
        <span v-if="trend" :class="[trendIsUp ? 'text-emerald-500' : 'text-rose-500', 'text-xs font-bold flex items-center']">
          <component :is="trendIsUp ? 'TrendingUp' : 'TrendingDown'" class="w-3 h-3 mr-1" />
          {{ trend }}
        </span>
        <span class="text-xs text-slate-400">{{ subText }}</span>
      </div>
    </div>
  </div>
</template>