<script setup>
import { ref, onMounted } from 'vue'
import { Plus } from 'lucide-vue-next'
import CampaignCard from '@/components/CampaignCard.vue'
import CampaignForm from '@/views/Campaigns/CampaignForm.vue'
import campaignService from '@/services/campaign.js'
import { useRoute, useRouter } from 'vue-router'
import departementService from '@/services/departement.js'
import userService from '@/services/users'
const route = useRoute()
const campagnId = ref();
const deptId = ref();

const id = route.params.id

const globalStats = ref({
  // departements: 0,
  chefs: [],
  agents: 0,
  animaux: 0,
})

async function loadDepartments() {
  try {
    const dataDept = await departementService.getDepartements()
    const dept = dataDept.find((d) => d.id === id)
    globalStats.value.agents = dept.stats.agents || 0
    globalStats.value.animaux = dept.stats.animals || 0

    const resChefs = await userService.getUsers({
      search: '',
      role: 'chef',
      dept: id,
    })
    globalStats.value.chefs = resChefs?.data?.items || resChefs.items || []
  } catch (err) {
    console.error('Erreur lors du chargement des départements :', err)
  }
}

const campaigns = ref([])
const stats = ref([])
const showForm = ref(false)

const loadCampaigns = async () => {
  try {
    const data = await campaignService.getCampaigns()
    campaigns.value = data.filter((c) => c.departement[0]?._id == id)
    const dataDept = await departementService.getDepartements()
    const dept = dataDept.find((d) => d.id === id)

    // Statistiques dynamiques
    const totalBudget = data.reduce((sum, c) => sum + (c.budget || 0), 0)
    const totalDepense = data.reduce((sum, c) => sum + (c.budgetDepense || 0), 0)
      ? Math.round(data.reduce((sum, c) => sum + (c.progression || 0), 0) / data.length)
      : 0
    const agent = (globalStats.value.agents = dept.stats.agents || 0)
    const animals = (globalStats.value.animaux = dept.stats.animals || 0)

    stats.value = [
      {
        title: 'Campagnes Actives',
        value:
          data.filter((c) => c.status === 'actif' && c.departement[0]?._id === id).length +
          '/' +
          data.filter((c) => c.departement[0]?._id === id).length,
        color: 'text-blue-600',
        bg: 'bg-blue-50',
        icon: Plus,
      },
      {
        title: 'Total Animals',
        value: animals,
        color: 'text-emerald-500',
        bg: 'bg-emerald-50',
        icon: Plus,
      },
      {
        title: 'Agents Impliqués',
        value: agent,
        color: 'text-purple-600',
        bg: 'bg-purple-50',
        icon: Plus,
      },
      {
        title: 'Budget Total',
        value: totalBudget.toLocaleString() + ' FCFA',
        color: 'text-orange-500',
        bg: 'bg-orange-50',
        icon: Plus,
      },
    ]
  } catch (err) {
    console.error(err)
  }
}

onMounted(() => {
  loadCampaigns()
  loadDepartments()
})

const handleFormClose = () => {
  showForm.value = false
  loadCampaigns() // recharger la liste après création
}

function handleUpdate (dept, camp) {
deptId.value = dept;
campagnId.value = camp;
showForm.value = true;
}

</script>

<template>
  <div>
    <header class="flex justify-between items-start mb-8">
      <div>
        <h1 class="text-3xl font-extrabold text-slate-900">Vue d'ensemble</h1>
        <p class="text-slate-500 mt-1">Une vue chirugicale sur votre département</p>
      </div>
    </header>

    <!-- Stats -->
    <div>
      Chef
      <div v-for="chef in globalStats.chefs" :key="chef._id">
        <div>{{ chef.name }}</div>
        <div>{{ chef.email }}</div>
        <div>{{ chef.num }}</div>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
      <div
        v-for="stat in stats"
        :key="stat.title"
        class="bg-white p-6 rounded-lg border border-slate-100 shadow-sm flex flex-col justify-between"
      >
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
        <CampaignCard v-for="campaign in campaigns" :key="campaign._id" @update="handleUpdate" :campaign="campaign" />
      </div>
    </div>

    <!-- Popup Form -->
    <CampaignForm v-if="showForm" :departementId="deptId"
          :campaignId="campagnId" @updated="window.location" @close="handleFormClose" />

    <!-- <CampaignForm
          v-if="showCampaignForm"
          :departementId="props.campaign?.departement[0]"
          :campaignId="props.campaign?._id"
          @close="showCampaignForm = false"
        /> -->
  </div>
</template>
