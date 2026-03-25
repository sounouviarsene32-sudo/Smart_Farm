<script setup>
import { ref, computed, onMounted } from 'vue'
import StardCard from './StardCard.vue'
import { Activity, Target, Beef, PawPrint, CheckCircle2, Clock, AlertCircle } from 'lucide-vue-next'
import dashboardService from '@/services/dashboard.js'
import todoService from '@/services/todo.js'
import campaignService from '@/services/campaign.js'
import animalService from '@/services/animals.js'
import { useLoginStore } from '@/stores/login.store'

// --- États ---
const loginStore = useLoginStore()
const currentUser = loginStore.getDecodedToken

const statsData = ref(null)
const overviewData = ref(null)
const agentTodos = ref([])
const agentCampaigns = ref([])
const agentAnimals = ref([])
const loading = ref(true)

// --- Appel API ---
const fetchData = async () => {
  try {
    loading.value = true

    // Récupération parallèle des données
    const [stats, overview, todos, campaigns] = await Promise.all([
      dashboardService.getStats(),
      dashboardService.getOverview(),
      todoService.getAgentTodos(currentUser._id),
      campaignService.getCampaigns()
    ])

    statsData.value = stats
    overviewData.value = overview
    agentTodos.value = todos.data || todos

    // Filtrer les campagnes de l'agent
    agentCampaigns.value = campaigns.filter(campaign =>
      campaign.agents?.some(agent => agent._id === currentUser._id || agent === currentUser._id)
    )

    // Récupérer les animaux des campagnes de l'agent
    const animalPromises = agentCampaigns.value.map(campaign =>
      animalService.getAnimalsByCampaign(campaign._id)
    )

    const animalResults = await Promise.all(animalPromises)
    agentAnimals.value = animalResults.flat()

  } catch (error) {
    console.error("Erreur dashboard Agent:", error)
  } finally {
    loading.value = false
  }
}

// --- Mapping des Stats ---
const dynamicStats = computed(() => {
  if (!statsData.value) return []

  const pendingTodos = agentTodos.value.filter(todo => todo.status !== 'completed').length
  const completedTodos = agentTodos.value.filter(todo => todo.status === 'completed').length

  return [
    {
      title: 'Mes Animaux',
      value: agentAnimals.value.length,
      subText: `${agentCampaigns.value.length} campagne(s) active(s)`,
      colorClass: 'text-emerald-500',
      icon: PawPrint,
    },
    {
      title: 'Tâches en Cours',
      value: pendingTodos,
      subText: `${completedTodos} terminée(s)`,
      colorClass: 'text-blue-500',
      icon: Clock,
    },
    {
      title: 'Campagnes Assignées',
      value: agentCampaigns.value.length,
      subText: 'Sous ma responsabilité',
      colorClass: 'text-purple-500',
      icon: Target,
    },
    {
      title: 'Tâches Terminées',
      value: completedTodos,
      subText: 'Ce mois-ci',
      colorClass: 'text-green-500',
      icon: CheckCircle2,
    },
  ]
})

// --- Transformation des ventes en "Activités" ---
// Remplacé par les tâches de l'agent
const formattedTodos = computed(() => {
  return agentTodos.value.slice(0, 5).map(todo => ({
    id: todo._id,
    title: todo.title,
    status: todo.status,
    priority: todo.priority,
    dueDate: todo.dueDate ? new Date(todo.dueDate).toLocaleDateString() : 'Non définie',
    campaign: todo.campaignId?.name || 'Campagne inconnue'
  }))
})

// --- Animaux récents ---
const recentAnimals = computed(() => {
  return agentAnimals.value.slice(0, 5).map(animal => ({
    id: animal._id,
    name: animal.name || `Animal ${animal._id.slice(-4)}`,
    type: animal.type || 'Type inconnu',
    status: animal.healthStatus || 'Bon état',
    campaign: agentCampaigns.value.find(c => c._id === animal.campaignId)?.name || 'Campagne inconnue'
  }))
})

onMounted(fetchData)
</script>
<template>
  <main class="flex-1 lg:ml-64 p-4 lg:p-8 bg-slate-50 min-h-screen space-y-8">
    
    <div v-if="loading" class="flex flex-col justify-center items-center h-64 space-y-4">
       <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
       <p class="text-slate-500 font-medium">Chargement de vos données...</p>
    </div>

    <template v-else>
      <header class="flex justify-between items-start mb-8">
        <div>
          <h2 class="text-2xl font-bold text-slate-800">Mon Espace Agent</h2>
          <p class="text-slate-500 text-sm">Suivi de mes tâches et animaux assignés</p>
        </div>
        <div class="hidden sm:block text-right text-sm text-slate-400">
          <p>Agent: <span class="text-slate-900 font-semibold">{{ currentUser?.name || 'Non défini' }}</span></p>
          <p>Date: <span class="text-slate-900 font-semibold">{{ new Date().toLocaleDateString() }}</span></p>
        </div>
      </header>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StardCard v-for="stat in dynamicStats" :key="stat.title" v-bind="stat" />
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- MES TÂCHES -->
        <div class="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <h3 class="font-bold text-slate-800 mb-6 flex items-center gap-2">
            <Clock class="w-5 h-5 text-blue-500" />
            Mes Tâches Récentes
          </h3>

          <p v-if="formattedTodos.length === 0" class="text-slate-400 text-sm italic">
            Aucune tâche assignée pour le moment.
          </p>

          <div v-else class="space-y-4">
            <div v-for="todo in formattedTodos" :key="todo.id" class="flex items-start gap-3 p-3 rounded-lg border border-slate-50 hover:bg-slate-50 transition-colors">
              <div
                class="w-3 h-3 rounded-full mt-1 flex-shrink-0"
                :class="todo.status === 'completed' ? 'bg-green-500' : todo.priority === 'high' ? 'bg-red-500' : 'bg-blue-500'"
              ></div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-semibold text-slate-800 truncate">{{ todo.title }}</p>
                <p class="text-xs text-slate-500">{{ todo.campaign }}</p>
                <p class="text-xs text-slate-400">Échéance: {{ todo.dueDate }}</p>
              </div>
              <span
                class="text-xs px-2 py-1 rounded-full font-medium flex-shrink-0"
                :class="todo.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'"
              >
                {{ todo.status === 'completed' ? 'Terminée' : 'En cours' }}
              </span>
            </div>
          </div>
        </div>

        <!-- MES ANIMAUX -->
        <div class="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <h3 class="font-bold text-slate-800 mb-6 flex items-center gap-2">
            <Beef class="w-5 h-5 text-emerald-500" />
            Mes Animaux ({{ agentAnimals.length }})
          </h3>

          <p v-if="recentAnimals.length === 0" class="text-slate-400 text-sm italic">
            Aucun animal dans vos campagnes.
          </p>

          <div v-else class="space-y-4">
            <div v-for="animal in recentAnimals" :key="animal.id" class="flex items-center gap-3 p-3 rounded-lg border border-slate-50 hover:bg-slate-50 transition-colors">
              <div class="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                <Beef class="w-5 h-5 text-emerald-600" />
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-semibold text-slate-800">{{ animal.name }}</p>
                <p class="text-xs text-slate-500">{{ animal.type }} • {{ animal.campaign }}</p>
              </div>
              <span
                class="text-xs px-2 py-1 rounded-full font-medium"
                :class="animal.status === 'Bon état' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'"
              >
                {{ animal.status }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- CAMPAGNES ACTIVES -->
      <div class="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <h3 class="font-bold text-slate-800 mb-6 flex items-center gap-2">
          <Target class="w-5 h-5 text-purple-500" />
          Mes Campagnes Actives
        </h3>

        <p v-if="agentCampaigns.length === 0" class="text-slate-400 text-sm italic">
          Aucune campagne active assignée.
        </p>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div v-for="campaign in agentCampaigns.slice(0, 6)" :key="campaign._id" class="p-4 rounded-lg border border-slate-100 hover:shadow-md transition-shadow">
            <div class="flex items-center justify-between mb-2">
              <h4 class="font-semibold text-slate-800 text-sm">{{ campaign.name }}</h4>
              <span class="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700">
                {{ campaign.status }}
              </span>
            </div>
            <p class="text-xs text-slate-500 mb-2">{{ campaign.description?.slice(0, 60) }}...</p>
            <div class="flex items-center justify-between text-xs text-slate-400">
              <span>{{ campaign.agents?.length || 0 }} agent(s)</span>
              <span>Progression: {{ campaign.progression || 0 }}%</span>
            </div>
          </div>
        </div>
      </div>
    </template>
  </main>
</template>