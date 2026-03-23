<script setup>
import { ref } from 'vue';
import { LayoutGrid, Users2, UserSquare, Beef, Plus } from 'lucide-vue-next';
import DepartmentsCard from '@/components/DepartmentsCard.vue';

const globalStats = [
  { label: 'Départements', value: '4', icon: LayoutGrid, color: 'text-blue-600', bg: 'bg-blue-50' },
  { label: 'Total Chefs', value: '4', icon: UserSquare, color: 'text-purple-500', bg: 'bg-purple-50' },
  { label: 'Total Agents', value: '31', icon: Users2, color: 'text-emerald-500', bg: 'bg-emerald-50' },
  { label: 'Total Animaux', value: '1250', icon: Beef, color: 'text-orange-500', bg: 'bg-orange-50' },
];

const departments = ref([
  {
    id: 1, name: 'Volaille', status: 'Actif',
    manager: { name: 'Jean Dupont', email: 'jean.dupont@elevage.com', phone: '+221 77 123 45 67' },
    stats: { agents: 12, animals: 450, perf: 92 }
  },
  {
    id: 2, name: 'Bovins', status: 'Actif',
    manager: { name: 'Marie Martin', email: 'marie.martin@elevage.com', phone: '+221 77 234 56 78' },
    stats: { agents: 8, animals: 320, perf: 88 }
  },
  {
    id: 3, name: 'Caprins', status: 'Actif',
    manager: { name: 'Pierre Durand', email: 'pierre.durand@elevage.com', phone: '+221 77 345 67 89' },
    stats: { agents: 6, animals: 280, perf: 85 }
  },
  {
    id: 4, name: 'Ovins', status: 'Actif',
    manager: { name: 'Sophie Bernard', email: 'sophie.bernard@elevage.com', phone: '+221 77 456 78 90' },
    stats: { agents: 5, animals: 200, perf: 82 }
  }
]);
</script>

<template>
  <main class="flex-1 lg:ml-64 p-4 lg:p-8 transition-all duration-300 w-full bg-red-50 min-h-screen space-y-8">
    <header class="flex justify-between items-start mb-10">
      <div>
        <h1 class="text-3xl font-extrabold text-slate-900">Départements</h1>
        <p class="text-slate-500 mt-1">Vue organisationnelle de l'élevage</p>
      </div>
      <button class="bg-gray-800 text-white px-5 py-3 rounded-xl flex items-center gap-2.5 text-sm font-bold shadow-sm transition-hover hover:scale-105 active:scale-95">
        <Plus class="w-5 h-5" /> Nouveau Département
      </button>
    </header>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
      <div v-for="stat in globalStats" :key="stat.label" class="bg-white p-6 rounded-lg border border-slate-100 shadow-sm flex items-center justify-between">
        <div class="space-y-1">
          <p class="text-xs font-semibold text-slate-400 uppercase tracking-wider">{{ stat.label }}</p>
          <p class="text-3xl font-extrabold text-slate-900">{{ stat.value }}</p>
        </div>
        <div :class="[stat.bg, stat.color, 'p-4 rounded-2xl']">
          <component :is="stat.icon" class="w-6 h-6" />
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <DepartmentsCard v-for="dept in departments" :key="dept.id" :dept="dept" />
    </div>
  </main>
</template>