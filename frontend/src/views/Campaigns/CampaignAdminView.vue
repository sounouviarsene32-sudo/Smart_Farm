<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Target, CheckCircle2, TrendingUp, DollarSign, Plus } from 'lucide-vue-next'
import CampaignCard from '../../components/CampaignCard.vue'
import campaignService from '@/services/campaign.js'
 
const router = useRouter()

const stats = ref([
  { title: 'Campagnes Actives', value: 0, icon: Target, color: 'text-blue-600', bg: 'bg-blue-50' },
  {
    title: 'Total Campagnes',
    value: 0,
    icon: CheckCircle2,
    color: 'text-emerald-500',
    bg: 'bg-emerald-50',
  },
  {
    title: 'Progression Moy.',
    value: '0%',
    icon: TrendingUp,
    color: 'text-purple-600',
    bg: 'bg-purple-50',
  },
  {
    title: 'Budget Total',
    value: '0 FCFA',
    icon: DollarSign,
    color: 'text-orange-500',
    bg: 'bg-orange-50',
  },
])

const campaigns = ref([])
const loading = ref(true)

async function loadCampaigns() {
  try {
    loading.value = true
    const data = await campaignService.getCampaigns()
    campaigns.value = data

    // Calcul rapide des stats
    const actives = data.filter((c) => c.progression < 100).length
    const totalBudget = data.reduce((acc, c) => acc + (c.budgetTotal || 0), 0)
    const avgProgress =
      data.length > 0
        ? Math.round(data.reduce((acc, c) => acc + (c.progression || 0), 0) / data.length)
        : 0

    stats.value = [
      {
        title: 'Campagnes Actives',
        value: actives,
        icon: Target,
        color: 'text-blue-600',
        bg: 'bg-blue-50',
      },
      {
        title: 'Total Campagnes',
        value: data.length,
        icon: CheckCircle2,
        color: 'text-emerald-500',
        bg: 'bg-emerald-50',
      },
      {
        title: 'Progression Moy.',
        value: `${avgProgress}%`,
        icon: TrendingUp,
        color: 'text-purple-600',
        bg: 'bg-purple-50',
      },
      {
        title: 'Budget Total',
        value: `${totalBudget.toLocaleString()} FCFA`,
        icon: DollarSign,
        color: 'text-orange-500',
        bg: 'bg-orange-50',
      },
    ]
  } catch (err) {
    console.error('Erreur chargement campagnes:', err)
  } finally {
    loading.value = false
  }
}

onMounted(() => loadCampaigns())
</script>

<template>
  <main
    class="flex-1 lg:ml-64 p-4 lg:p-8 transition-all duration-300 w-full bg-red-50 min-h-screen space-y-8"
  >
    <header class="flex justify-between items-start mb-8">
      <div>
        <h1 class="text-3xl font-extrabold text-slate-950">Campagnes</h1>
        <p class="text-slate-500 mt-1">Gestion des campagnes et projets</p>
      </div>
      <button
        @click="router.push({ name: 'CampagneAdminForm' })"
        class="flex items-center gap-2.5 px-6 py-3.5 bg-slate-950 text-white rounded-xl text-sm font-semibold shadow-sm hover:bg-slate-800"
      >
        <Plus class="w-5 h-5" /> Nouvelle Campagne
      </button>
    </header>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
      <div
        v-for="stat in stats"
        :key="stat.title"
        class="bg-white p-6 rounded-lg border border-slate-100 shadow-sm flex flex-col justify-between"
      >
        <div class="flex justify-between items-start">
          <span class="text-sm font-medium text-slate-500">{{ stat.title }}</span>
          <div :class="['p-2.5 rounded-xl', stat.bg, stat.color]">
            <component :is="stat.icon" class="w-5 h-5" />
          </div>
        </div>
        <h3 class="text-3xl font-extrabold text-slate-900 mt-5">{{ stat.value }}</h3>
      </div>
    </div>

    <div class="space-y-6">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-xl font-bold text-slate-900">Campagnes en Cours</h2>
      </div>

      <div class="space-y-6">
        <CampaignCard v-for="campaign in campaigns" :key="campaign.id" :campaign="campaign" />
      </div>
    </div>
  </main>
</template>
