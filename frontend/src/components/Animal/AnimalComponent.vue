<script setup>
import { ref, onMounted, watch } from 'vue'
import AnimalService from '@/services/animals.js'
import AnimalForm from '@/views/Form/AnimalForm.vue'
import { useLoginStore } from '@/stores/login.store'
import { useRoute } from 'vue-router'
import {
  Plus,
  Search,
  Beef,
  Bird,
  ExternalLink,
  ShieldCheck,
  HeartPulse,
  AlertCircle,
  Activity,
} from 'lucide-vue-next'
const route = useRoute()
const campaignId = route.params.campaignId

const loginStore = useLoginStore()
const currentUser = loginStore.getDecodedToken

const animals = ref([])
const animalStats = ref([])
const qrInput = ref('')

async function loadAnimals() {
  try {
    let data = []

    if (campaignId) {
      // Si campaignId est passé en prop (pour les vues spécifiques)
      data = await AnimalService.getAnimalsByCampaign(campaignId)
      data = data.filter((a) => a.status == 'actif')
    }
    //  else if (currentUser.role === 'agent') {
    //   // Pour les agents : récupérer les animaux de leurs campagnes uniquement
    //   const campaigns = await campaignService.getCampaigns()
    //   const agentCampaigns = campaigns.filter((c) => {
    //     const agentIds = c.agents?.map(agent => agent._id || agent) || []
    //     return agentIds.includes(currentUser._id)
    //   })

    //   // Récupérer tous les animaux de ces campagnes
    //   const animalPromises = agentCampaigns.map(campaign =>
    //     AnimalService.getAnimalsByCampaign(campaign._id)
    //   )
    //   const animalArrays = await Promise.all(animalPromises)
    //   data = animalArrays.flat()
    // }
    // else {
    //   // Pour les autres rôles (admin, chef) : tous les animaux
    //   data = await AnimalService.getAnimals()
    // }

    animals.value = data.map((a) => ({
      id: a._id,
      qrCodeUrl: a.qrCodeUrl,
      identificationNumber: a.identificationNumber,
      name: `${a.species} #${a.identificationNumber}`,
      dept: a.departementId,
      campaign: a.campaignId,
      breed: a.breed,
      weight: a.weight ? `${a.weight} kg` : '-',
      healthStatus: a.healthStatus || 'sain',
      status: a.status || 'sain',
      typeIcon: a.species.toLowerCase().includes('poulet') ? Bird : Beef,
    }))

    // Calcul des stats
    const total = animals.value.filter((a) => a.status == 'actif').length
    const sain = animals.value.filter(
      (a) => a.status === 'actif' && a.healthStatus === 'sain',
    ).length
    const traitement = animals.value.filter((a) => a.healthStatus === 'traitement').length
    const critique = animals.value.filter((a) => a.healthStatus === 'malade').length

    animalStats.value = [
      { label: 'Total Cheptel', value: total, icon: Beef, color: 'text-orange-500' },
      { label: 'En Bonne Santé', value: sain, icon: ShieldCheck, color: 'text-emerald-500' },
      { label: 'Sous Traitement', value: traitement, icon: HeartPulse, color: 'text-blue-500' },
      { label: 'Alertes Vitales', value: critique, icon: AlertCircle, color: 'text-rose-500' },
    ]
  } catch (err) {
    console.error('Erreur chargement animaux:', err)
  }
}

const showForm = ref(false)

const openForm = () => {
  showForm.value = true
}

const handleCreated = () => {
  showForm.value = false
  loadAnimals() // recharge la liste après ajout
}

onMounted(loadAnimals)
watch(() => campaignId, loadAnimals)

const getStatusClass = (healthStatus) => {
  switch (healthStatus) {
    case 'sain':
      return 'bg-emerald-500 text-white'
    case 'traitement':
      return 'bg-blue-600 text-white'
    case 'malade':
      return 'bg-rose-500 text-white'
    default:
      return 'bg-slate-400 text-white'
  }
}

// Modal QR Code
const showQRModal = ref(false)
const selectedAnimal = ref(null)

const openQRModal = (animal) => {
  selectedAnimal.value = animal
  showQRModal.value = true
}

const closeQRModal = () => {
  showQRModal.value = false
  selectedAnimal.value = null
}
</script>

<template>
  <header class="flex justify-between items-start mb-10">
    <div>
      <h1 class="text-2xl font-extrabold text-slate-900">
        {{ currentUser.role === 'agent' ? 'Vos Animaux' : 'Animaux' }}
      </h1>
      <p class="text-slate-500 mt-1">
        {{
          currentUser.role === 'agent'
            ? 'Suivi des animaux de vos campagnes'
            : 'Gestion individuelle'
        }}
      </p>
    </div>
    <button
      v-if="currentUser.role !== 'agent'"
      @click="openForm"
      class="flex items-center gap-2.5 px-6 py-3 bg-blue-600 text-white rounded-xl text-sm font-semibold shadow-sm hover:bg-blue-500 transition-all"
    >
      <Plus class="w-5 h-5" /> Enregistrer un Animal
    </button>
  </header>

  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
    <div
      v-for="stat in animalStats"
      :key="stat.label"
      class="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between"
    >
      <div class="flex justify-between items-start">
        <span class="text-sm font-medium text-slate-500">{{ stat.label }}</span>
        <div :class="['p-2.5 rounded-xl bg-slate-50', stat.color]">
          <component :is="stat.icon" class="w-5 h-5" />
        </div>
      </div>
      <h3 class="text-3xl font-extrabold text-slate-900 mt-5">{{ stat.value }}</h3>
    </div>
  </div>

  <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
    <div class="lg:col-span-2 space-y-6">
      <div class="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
        <div class="flex flex-wrap items-center justify-between gap-4 mb-6">
          <h2 class="text-xl font-bold text-slate-900">Liste des Animaux</h2>
          <div class="relative flex-1 max-w-sm">
            <Search class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Rechercher un ID, un nom ou une race..."
              class="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-slate-950 outline-none transition-all"
            />
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left text-sm border-collapse">
            <thead
              class="bg-slate-50/50 text-slate-400 font-semibold text-xs uppercase tracking-wider"
            >
              <tr>
                <th class="px-6 py-4">ID / Nom</th>
                <th class="px-6 py-4">Espèce / Race</th>
                <th class="px-6 py-4">Poids</th>
                <th class="px-6 py-4 text-center">Santé</th>
                <th class="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-50 font-medium">
              <tr
                v-for="animal in animals"
                :key="animal.id"
                class="hover:bg-slate-50/30 transition-colors"
              >
                <td class="px-6 py-4">
                  <div class="flex items-center gap-3">
                    <img
                      v-if="animal.qrCodeUrl"
                      :src="animal.qrCodeUrl"
                      alt="QR Code"
                      class="w-15 h-15 rounded-lg cursor-pointer hover:scale-110 transition-transform"
                      @click="openQRModal(animal)"
                    />
                    <div>
                      <div class="font-bold text-slate-900">{{ animal.name }}</div>
                      <div class="text-[10px] text-slate-400 font-mono">{{ animal.id }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <div class="text-slate-900 font-bold text-xs">{{ animal.dept }}</div>
                  <div class="text-[10px] text-slate-400 uppercase tracking-tighter">
                    {{ animal.breed }}
                  </div>
                </td>
                <td class="px-6 py-4 text-slate-500">{{ animal.weight }}</td>
                <td class="px-6 py-4 text-center">
                  <span
                    :class="[
                      getStatusClass(animal.healthStatus),
                      'px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-tight',
                    ]"
                  >
                    {{ animal.healthStatus }}
                  </span>
                </td>
                <td class="px-6 py-4 text-right">
                  <button class="p-2 text-slate-400 hover:text-slate-950 transition-colors">
                    <ExternalLink class="w-4 h-4" />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div class="space-y-8">
      <div class="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
        <h3 class="font-bold text-slate-900 mb-6 flex items-center gap-2">
          <Activity class="w-4 h-4 text-slate-400" /> Activités Récentes
        </h3>
        <div class="space-y-6">
          <div v-for="i in 3" :key="i" class="flex items-start gap-4">
            <div class="w-2 h-2 rounded-full bg-emerald-500 mt-2"></div>
            <div>
              <p class="text-sm font-bold text-slate-900">Vaccination effectuée</p>
              <p class="text-xs text-slate-400 mt-1">Lot VOL-452 - Vaccination Grippe</p>
              <p class="text-[10px] text-slate-300 mt-1 font-medium uppercase">Il y a 2 heures</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <AnimalForm
    v-if="showForm"
    :campaign-id="campaignId"
    @close="showForm = false"
    @created="handleCreated"
  />

  <!-- Modal QR Code -->
  <div
    v-if="showQRModal && selectedAnimal"
    class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
    @click="closeQRModal"
  >
    <div class="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full mx-4" @click.stop>
      <div class="flex justify-between items-start mb-6">
        <div>
          <h3 class="text-xl font-bold text-slate-900">QR Code Animal</h3>
          <p class="text-slate-500 text-sm mt-1">{{ selectedAnimal?.name }}</p>
        </div>
        <button @click="closeQRModal" class="p-2 hover:bg-slate-100 rounded-lg transition-colors">
          <svg class="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            ></path>
          </svg>
        </button>
      </div>

      <div class="flex flex-col items-center space-y-4">
        <img
          :src="selectedAnimal?.qrCodeUrl"
          alt="QR Code"
          class="w-64 h-64 border-2 border-slate-200 rounded-xl"
        />

        <div class="text-center space-y-2">
          <p class="text-sm font-mono text-slate-600">{{ selectedAnimal?.id }}</p>
          <p class="text-xs text-slate-400">ID: {{ selectedAnimal?.identificationNumber }}</p>
        </div>

        <div class="flex gap-3 w-full">
          <button
            @click="closeQRModal"
            class="flex-1 px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors"
          >
            Fermer
          </button>
          <button
            class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-500 transition-colors"
          >
            Imprimer
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
