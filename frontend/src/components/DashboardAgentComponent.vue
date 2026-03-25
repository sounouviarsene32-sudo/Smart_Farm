<script setup>
import { ref, computed, onMounted } from 'vue'
import StardCard from './StardCard.vue'
import { Activity, Target, Beef, PawPrint } from 'lucide-vue-next'
import dashboardService from '@/services/dashboard.js'

// --- États ---
const statsData = ref(null)
const overviewData = ref(null)
const loading = ref(true)

// --- Appel API ---
const fetchData = async () => {
  try {
    loading.value = true
    // On récupère les stats et l'aperçu (recentSales, etc.)
    const [stats, overview] = await Promise.all([
      dashboardService.getStats(),
      dashboardService.getOverview()
    ])
    statsData.value = stats
    overviewData.value = overview
  } catch (error) {
    console.error("Erreur dashboard Agent:", error)
  } finally {
    loading.value = false
  }
}

// --- Mapping des Stats ---
const dynamicStats = computed(() => {
  if (!statsData.value) return []
  
  return [
    {
      title: 'Total Animaux Suivis',
      value: statsData.value.totalAnimals || 0,
      subText: 'Enregistrés en base',
      colorClass: 'text-emerald-500',
      icon: PawPrint,
    },
    {
      title: 'Taux de Mortalité',
      value: '3.2%', // Si tu n'as pas encore la stat, on peut la laisser en dur ou la calculer
      subText: 'Moyenne exploitation',
      colorClass: 'text-rose-500',
      icon: Activity,
    },
    {
      title: 'Ventes Effectuées',
      value: statsData.value.totalSales || 0,
      subText: 'Depuis le début',
      colorClass: 'text-blue-500',
      icon: Beef,
    },
    {
      title: 'Campagnes Actives',
      value: statsData.value.activeCampaigns || 0,
      subText: `Sur ${statsData.value.totalCampaigns || 0} campagnes`,
      colorClass: 'text-purple-500',
      icon: Target,
    },
  ]
})

// --- Transformation des ventes en "Activités" ---
const formattedActivities = computed(() => {
  if (!overviewData.value?.recentSales) return []
  
  return overviewData.value.recentSales.map(sale => ({
    id: sale._id,
    desc: `Vente de ${sale.quantity || ''} ${sale.product || 'unité(s)'}`,
    user: sale.client || 'Client externe',
    // On formate la date MongoDB
    time: sale.createdAt ? new Date(sale.createdAt).toLocaleDateString() : 'Récemment',
    cat: sale.category || 'Vente'
  }))
})

onMounted(fetchData)
</script>
<template>
  <main class="flex-1 lg:ml-64 p-4 lg:p-8 bg-red-50 min-h-screen space-y-8">
    
    <div v-if="loading" class="flex flex-col justify-center items-center h-64 space-y-4">
       <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
       <p class="text-slate-500 font-medium">Chargement de vos données...</p>
    </div>

    <template v-else>
      <header class="flex justify-between items-start mb-8">
        <div>
          <h2 class="text-2xl font-bold text-slate-800">Dashboard Agent</h2>
          <p class="text-slate-500 text-sm">Vue d'ensemble de l'exploitation</p>
        </div>
        <div class="hidden sm:block text-right text-sm text-slate-400">
          <p>Saison: <span class="text-slate-900 font-semibold">2025/2026</span></p>
          <p>Date: <span class="text-slate-900 font-semibold">{{ new Date().toLocaleDateString() }}</span></p>
        </div>
      </header>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StardCard v-for="stat in dynamicStats" :key="stat.title" v-bind="stat" />
      </div>

      <div class="grid grid-cols-1 gap-6">
        <div class="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <h3 class="font-bold text-slate-800 mb-6">Activités Récentes (Ventes)</h3>
          
          <p v-if="formattedActivities.length === 0" class="text-slate-400 text-sm italic">
            Aucune vente enregistrée récemment.
          </p>

          <div class="space-y-6">
            <div v-for="act in formattedActivities" :key="act.id" class="flex gap-4 items-start border-b border-slate-50 pb-4 last:border-0">
              <div
                class="w-2 h-2 rounded-full mt-2"
                :class="act.cat === 'Volaille' ? 'bg-emerald-500' : 'bg-blue-500'"
              ></div>
              <div class="flex-1">
                <p class="text-sm font-bold text-slate-800">{{ act.desc }}</p>
                <p class="text-xs text-slate-400">{{ act.user }} • {{ act.time }}</p>
              </div>
              <span class="text-[10px] bg-slate-100 px-2 py-1 rounded text-slate-500 uppercase font-bold">
                {{ act.cat }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </template>
  </main>
</template>