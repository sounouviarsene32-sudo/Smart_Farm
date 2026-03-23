<script setup>
import { ref, computed } from 'vue'
import AppSidebar from './AppSidebar.vue'
import StardCard from './StardCard.vue'
import { Users, Activity, Percent, Target, TrendingUp, TrendingDown, Beef, PawPrint } from 'lucide-vue-next'



// Gestion des interfaces

const stats = [
  {
    title: 'Total Animaux Suvis',
    value: '1250',
    subText: 'Répartis sur 4 départements',
    colorClass: 'text-emerald-500',
    icon: PawPrint,
    trend: null,
  },
  {
    title: 'Taux de Mortalité',
    value: '3.2%',
    subText: 'vs mois dernier',
    trend: '0.5%',
    trendIsUp: false, // Flèche rouge vers le bas
    colorClass: 'text-rose-500',
    icon: Activity,
  },
  {
    title: 'Département de service',
    value: 'Bovins',
    subText: 'avec 528 agents',
    trendIsUp: true, // Flèche bleue/verte vers le haut
    colorClass: 'text-blue-500',
    icon: Beef,
  },
  {
    title: 'Campagnes de service',
    value: 'Vente de fin d\'année, Campagne de vaccination...',
    subText: 'affecté à 8 campagnes',
    colorClass: 'text-purple-500',
    icon: Target,
    trend: null,
  },
]


// activités récentes
const activities = ref([
  {
    id: 1,
    type: 'Vente',
    desc: 'Vente de 50 poulets',
    user: 'Jean Dupont',
    time: 'Il y a 2h',
    cat: 'Volaille',
  },
  {
    id: 2,
    type: 'Santé',
    desc: 'Vaccination de 20 bovins',
    user: 'Marie Martin',
    time: 'Il y a 3h',
    cat: 'Bovins',
  },
])

</script>

<template>

    <main class="flex-1 lg:ml-64 p-4 lg:p-8 transition-all duration-300 w-full bg-red-50 min-h-screen space-y-8">
      <header class="flex justify-between items-start mb-8">
        <div>
          <h2 class="text-2xl font-bold text-slate-800">Dashboard Agent</h2>
          <p class="text-slate-500 text-sm">Vue d'ensemble de l'exploitation</p>
        </div>
        <div class="hidden sm:block text-right text-sm text-slate-400">
          <p>Saison: <span class="text-slate-900 font-semibold">2025/2026</span></p>
          <p>Date: <span class="text-slate-900 font-semibold">19/03/2026</span></p>
        </div>
      </header>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StardCard v-for="stat in stats" :key="stat.title" v-bind="stat" />
      </div>

      <div class="grid grid-cols-1 gap-6">
        <div class="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <h3 class="font-bold text-slate-800 mb-6">Activités Récentes</h3>
          <div class="space-y-6">
            <div v-for="act in activities" :key="act.id" class="flex gap-4 items-start">
              <div
                class="w-2 h-2 rounded-full mt-2"
                :class="act.cat === 'Volaille' ? 'bg-emerald-500' : 'bg-blue-500'"
              ></div>
              <div class="flex-1">
                <p class="text-sm font-bold text-slate-800">{{ act.desc }}</p>
                <p class="text-xs text-slate-400">{{ act.user }} • {{ act.time }}</p>
              </div>
              <span
                class="text-[10px] bg-slate-100 px-2 py-1 rounded text-slate-500 uppercase font-bold"
                >{{ act.cat }}</span
              >
            </div>
          </div>
        </div>
      </div>
    </main>
</template>
