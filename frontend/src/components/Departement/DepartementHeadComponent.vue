<script setup>
import DepartementForm from '@/views/Form/DepartementForm.vue'
import departementService from '@/services/departement.js';
import { onMounted, ref } from 'vue'
import { Plus, LayoutGrid, Target, ChevronRight, PlusCircle } from 'lucide-vue-next'
import { useRouter, useRoute } from 'vue-router'
import CampaignForm from '@/views/Campaigns/CampaignForm.vue'
const departement = ref()
const showCampaignForm = ref()

const props = defineProps({
  departementName: {
    type: String,
    default: 'Général'
  }
})

const campaigns = ref([
  { _id: '1', name: 'Campagne Poulets 2026' },
  { _id: '2', name: 'Campagne Pondeuses' },
])
const showForm = ref(false)
const router = useRouter()
const route = useRoute()

const allCampaigns = async () => {
  const id = route.params.id

  departement.value = await departementService.getDepartementById(id)
  campaigns.value = departement.value.stats.campagnes
}

// Liste fictive ou récupérée de ton API pour les rubriques

function openForm() { showForm.value = true }
function closeForm() { showForm.value = false }


const handleCampaignCreated = () => {
  showCampaignForm.value = false
  allCampaigns() // Rafraîchir la liste dans la barre de navigation
}

function onDepartmentCreated(dept) {
  // Logique de mise à jour...
  closeForm()
}
onMounted(allCampaigns)
</script>

<template>
  <main class="flex-1 p-4 lg:p-10 bg-slate-50 min-h-screen lg:ml-16">
    <header class="space-y-6 mb-8">
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-3xl font-extrabold text-slate-900 flex items-center gap-3">
            <span class="bg-blue-600 w-2 h-8 rounded-full"></span>
            {{ departement?.name }}
          </h1>
          <p class="text-slate-500 mt-1 ml-5">Vue organisationnelle de l'élevage</p>
        </div>
        
        <button
          @click="openForm"
          class="bg-slate-900 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 text-sm font-bold shadow-sm hover:bg-slate-800 transition-all"
        >
          <Plus class="w-4 h-4" /> Nouveau Département
        </button>
      </div>

      <nav class="flex items-center gap-2 border-b border-slate-200 pb-1 overflow-x-auto no-scrollbar">
        <router-link
          :to="{ name: 'departments-home' }"
          class="px-4 py-2 flex items-center gap-2 text-sm font-medium transition-all border-b-2"
          :class="route.name === 'department-home' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'"
        >
          <LayoutGrid class="w-4 h-4" /> Vue d'ensemble
        </router-link>

        <div class="h-4 w-px bg-slate-300 mx-2"></div>

        <router-link
          v-for="camp in campaigns"
          :key="camp.id"
          :to="{ name: 'campaign-admin', params: { campaignId: camp._id } }"
          class="px-4 py-2 flex items-center gap-2 text-sm font-medium transition-all border-b-2 whitespace-nowrap"
          :class="route.params.id === camp.id ? 'border-blue-600 text-blue-600 bg-blue-50/50 rounded-t-lg' : 'border-transparent text-slate-500 hover:text-slate-700'"
        >
          <Target class="w-4 h-4" />
          {{ camp.name }}
        </router-link>

        <button
        @click="showCampaignForm = true"
        class="ml-4 p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex items-center gap-1 group"
        title="Ajouter une campagne"
      >
        <PlusCircle class="w-5 h-5 group-hover:scale-110 transition-transform" />
        <span class="text-xs font-bold hidden md:inline">Nouvelle Campagne</span>
      </button>
      </nav>
    </header>

    <div class="mt-6">
      <router-view />
    </div>

    <DepartementForm :show="showForm" @close="closeForm" @created="onDepartmentCreated" />
    <CampaignForm 
    v-if="showCampaignForm" 
    :departementId="deptId"
    @close="showCampaignForm = false" 
    @created="handleCampaignCreated" 
  />
  </main>
</template>

<style scoped>
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
</style>