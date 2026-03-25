<script setup>
import { ref, onMounted } from 'vue'
import { Plus } from 'lucide-vue-next'
import CampaignCard from '@/components/CampaignCard.vue'
import CampaignForm from './CampaignForm.vue'
import campaignService from '@/services/campaign.js'

const campaigns = ref([])
const stats = ref([])
const showForm = ref(false)

const loadCampaigns = async () => {
  try {
    const data = await campaignService.getCampaigns()
    campaigns.value = data

    // Statistiques dynamiques
    const totalBudget = data.reduce((sum, c) => sum + (c.budget || 0), 0)
    const totalDepense = data.reduce((sum, c) => sum + (c.budgetDepense || 0), 0)
    const progressionMoyenne = data.length
      ? Math.round(data.reduce((sum, c) => sum + (c.progression || 0), 0) / data.length)
      : 0
    const totalAnimals = data.reduce((sum, c) => sum + (c.animalsCount || 0), 0) // 🔥 ajout animaux

    stats.value = [
      { title: 'Campagnes Actives', value: data.filter(c => c.status === 'actif').length, color: 'text-blue-600', bg: 'bg-blue-50', icon: Plus },
      { title: 'Total Campagnes', value: data.length, color: 'text-emerald-500', bg: 'bg-emerald-50', icon: Plus },
      { title: 'Progression Moy.', value: progressionMoyenne + '%', color: 'text-purple-600', bg: 'bg-purple-50', icon: Plus },
      { title: 'Cheptel Total', value: totalAnimals + ' Têtes', color: 'text-orange-500', bg: 'bg-orange-50', icon: Plus } // 🔥 nouveau stat
    ]
  } catch (err) {
    console.error(err)
  }
}

onMounted(() => loadCampaigns())

const handleFormClose = () => {
  showForm.value = false
  loadCampaigns() // recharger la liste après création
}
</script>

<template>
  <main class="flex-1 lg:ml-64 p-4 lg:p-8 w-full bg-red-50 min-h-screen space-y-8">
    
    <header class="flex justify-between items-start mb-8">
      <div>
        <h1 class="text-3xl font-extrabold text-slate-950">Campagnes</h1>
        <p class="text-slate-500 mt-1">Gestion des campagnes et projets</p>
      </div>
      <button @click="showForm = true" class="flex items-center gap-2.5 px-6 py-3.5 bg-slate-950 text-white rounded-xl text-sm font-semibold shadow-sm hover:bg-slate-800">
        <Plus class="w-5 h-5" /> Nouvelle Campagne
      </button>
    </header>

    <!-- Stats -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
      <div v-for="stat in stats" :key="stat.title" class="bg-white p-6 rounded-lg border border-slate-100 shadow-sm flex flex-col justify-between">
        <div class="flex justify-between items-start">
          <span class="text-sm font-medium text-slate-500">{{ stat.title }}</span>
          <div :class="['p-2.5 rounded-xl', stat.bg, stat.color]">
            <Plus class="w-5 h-5" />
          </div>
        </div>
        <h3 class="text-3xl font-extrabold text-slate-900 mt-5">{{ stat.value }}</h3>
      </div>
    </div>

    <!-- Campagnes -->
    <div class="space-y-6">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-xl font-bold text-slate-900">Campagnes en Cours</h2>
      </div>

      <div class="space-y-6">
        <!-- 🔥 Passe la campagne entière, elle contient animalsCount maintenant -->
        <CampaignCard v-for="campaign in campaigns" :key="campaign._id" :campaign="campaign" />
      </div>
    </div>

    <!-- Popup Form -->
    <CampaignForm v-if="showForm" @close="handleFormClose" />
  </main>
</template>