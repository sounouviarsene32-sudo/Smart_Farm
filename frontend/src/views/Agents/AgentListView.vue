<script setup>
import { ref, onMounted, computed, reactive, watch } from 'vue'
import { useToast } from 'vue-toastification'
import Swal from 'sweetalert2'
import agentService, { addAgent, updateAgent, deleteAgent, getAllAgents } from '@/services/agent.js'
import todoService from '@/services/todo.js'
import departementService from '@/services/departement.js'
import campaignService from '@/services/campaign.js'
import { useLoginStore } from '@/stores/login.store'

import {
  Users,
  CheckCircle2,
  Medal,
  TrendingUp,
  Search,
  Plus,
  Mail,
  Edit2,
  Trash2,
  X,
  Briefcase,
  ClipboardList,
  Clock,
  AlertCircle,
} from 'lucide-vue-next'

// ================= USER & AUTH =================
const loginStore = useLoginStore()
const currentUser = ref(loginStore.getDecodedToken)
const isChef = computed(() => currentUser.value?.role === 'chef')
const isAdmin = computed(() => currentUser.value?.role === 'admin')
const toast = useToast()

// ================= STATES =================
const isModalOpen = ref(false)
const isTodoModalOpen = ref(false)
const agents = ref([])
const allCampaignsRaw = ref([])
const campaigns = ref([])
const departments = ref([])
const toUpdate = ref(null)
const stats = ref([])
const search = ref('')
const isCampModalOpen = ref(false)
const selectedAgentForCamp = ref(null)
const availableCampaignsForAgent = ref([])

// État pour les Todos
const selectedAgent = ref(null)
const agentTodos = ref([])
const newTodo = reactive({
  title: '',
  description: '',
  priority: 'medium',
  dueDate: '',
  campaignId: '',
})

// ================= FORM STATE AGENT =================
const newAgent = reactive({
  name: '',
  email: '',
  poste: '',
  role: 'agent',
  dept: '',
  num: '',
  campaigns: [],
  haveCount: false,
})

// const newAgent = reactive({
//   // ... tes autres champs
//    // Utilise un tableau ici
// })

// Fonction utilitaire pour ajouter/enlever une campagne du formulaire
function toggleCampaignInForm(id) {
  const index = newAgent.campaigns.indexOf(id)
  if (index > -1) {
    newAgent.campaigns.splice(index, 1)
  } else {
    newAgent.campaigns.push(id)
  }
}

// ================= LOAD DATA =================
async function initData() {
  try {
    const [deptsRes, campsRes] = await Promise.all([
      departementService.getDepartements(),
      campaignService.getCampaigns(),
    ])
    departments.value = deptsRes.data || deptsRes
    allCampaignsRaw.value = campsRes.data || campsRes

    if (isChef.value && currentUser.value.dept) {
      const chefDeptId =
        currentUser.value.dept?._id || currentUser.value.dept?.id || currentUser.value.dept
      newAgent.dept = chefDeptId || ''
      filterCampaignsByDept(newAgent.dept)
    } else {
      campaigns.value = allCampaignsRaw.value
    }

    await fetchAgents()
  } catch (error) {
    console.error('Erreur initialisation:', error)
  }
}

async function fetchAgents() {
  try {
    const res = await getAllAgents({
      page: 1,
      limit: 50,
      search: search.value,
    })

    const allItems = res.data.items || res.data
    if (isChef.value) {
      agents.value = allItems.filter((a) => a.dept?.name === currentUser.value.dept?.name)
    } else {
      agents.value = allItems
    }

    updateStats()
  } catch (error) {
    console.error('Erreur agents:', error)
  }
}

// ================= GESTION DES TÂCHES (TODOS) =================
async function openTodoModal(agent) {
  selectedAgent.value = agent
  isTodoModalOpen.value = true
  await fetchAgentTodos(agent._id)
}

async function fetchAgentTodos(agentId) {
  try {
    const res = await todoService.getAgentTodos(agentId)
    agentTodos.value = res.data
  } catch (error) {
    console.error('Erreur todos:', error)
  }
}

async function handleAddTodo() {
  try {
    await todoService.createTodo({
      ...newTodo,
      agentId: selectedAgent.value._id,
      campaignId: newTodo.campaignId || selectedAgent.value.camp?._id,
    })
    // Reset form todo
    newTodo.title = ''
    newTodo.description = ''
    await fetchAgentTodos(selectedAgent.value._id)
  } catch (error) {
    console.error('Erreur ajout todo:', error)
  }
}

async function toggleTodoStatus(todo) {
  const nextStatus = todo.status === 'completed' ? 'pending' : 'completed'
  try {
    await todoService.updateStatus(todo._id, { status: nextStatus })
    await fetchAgentTodos(selectedAgent.value._id)
  } catch (error) {
    console.error(error)
  }
}

async function deleteTodo(todoId) {
  const result = await Swal.fire({
    title: 'Supprimer cette tâche?',
    text: 'Êtes-vous sûr de vouloir supprimer cette tâche?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#dc2626',
    cancelButtonColor: '#6b7280',
    confirmButtonText: 'Oui, supprimer',
    cancelButtonText: 'Annuler',
  })

  if (result.isConfirmed) {
    await todoService.deleteTodo(todoId)
    await fetchAgentTodos(selectedAgent.value._id)
  }
}

// ================= FILTRAGE & STATS =================
function filterCampaignsByDept(deptId) {
  if (!deptId) {
    campaigns.value = allCampaignsRaw.value
    return
  }
  campaigns.value = allCampaignsRaw.value.filter((c) => {
    // departement est un tableau d'objets peuplés (après populate)
    const isIncluded = c.departement && c.departement.some((dep) => (dep._id || dep.id) === deptId)
    return isIncluded
  })
}

watch(
  () => newAgent.dept,
  (newVal) => filterCampaignsByDept(newVal),
)

function updateStats() {
  stats.value = [
    {
      title: 'Total Agents',
      value: agents.value.length,
      icon: Users,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      title: 'Agents Actifs',
      value: agents.value.filter((a) => a.isActive).length,
      icon: CheckCircle2,
      color: 'text-emerald-500',
      bg: 'bg-emerald-50',
    },
    {
      title: 'Départements',
      value: departments.value.length,
      icon: Medal,
      color: 'text-orange-500',
      bg: 'bg-orange-50',
    },
    {
      title: 'Campagnes Dept',
      value: campaigns.value.length,
      icon: TrendingUp,
      color: 'text-purple-500',
      bg: 'bg-purple-50',
    },
  ]
}

// ================= CRUD AGENT =================
const resetForm = () => {
  Object.assign(newAgent, {
    name: '',
    email: '',
    poste: '',
    role: 'agent',
    dept: isChef.value
      ? currentUser.value.dept?._id || currentUser.value.dept?.id || currentUser.value.dept || ''
      : '',
    num: '',
    camp: '',
    haveCount: false,
  })
  isModalOpen.value = false
  toUpdate.value = null
}

const handleSubmit = async () => {
  try {
    const payload = {
      ...newAgent,
      dept: newAgent.dept || undefined,
      haveCount: Boolean(newAgent.haveCount),
    }

    // Normalize objectId values when received from objects
    if (payload.dept && typeof payload.dept === 'object') {
      payload.dept = payload.dept._id || payload.dept.id || payload.dept
    }
    if (payload.camp && typeof payload.camp === 'object') {
      payload.camp = payload.camp._id || payload.camp.id || payload.camp
    }

    if (toUpdate.value) {
      await updateAgent(toUpdate.value._id, payload)
      toast.success('Agent mis à jour avec succès.')
    } else {
      await addAgent(payload)
      toast.success('Agent ajouté avec succès.')
    }

    await fetchAgents()
    resetForm()
  } catch (error) {
    console.error(error)
    toast.error(
      error.response?.data?.error || error.message || 'Échec lors de l’enregistrement de l’agent.',
    )
  }
}

function editing(user) {
  toUpdate.value = user
  Object.assign(newAgent, {
    name: user.name,
    email: user.email,
    poste: user.poste,
    role: 'agent',
    dept: user.dept?._id || user.dept || '',
    num: user.num,
    camp: user.camp?._id || user.camp || '',
    haveCount: user.haveCount,
  })
  isModalOpen.value = true
}

const handleDelete = async (userId) => {
  const result = await Swal.fire({
    title: 'Supprimer cet agent?',
    text: 'Êtes-vous sûr de vouloir supprimer cet agent? Cette action est irréversible.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#dc2626',
    cancelButtonColor: '#6b7280',
    confirmButtonText: 'Oui, supprimer',
    cancelButtonText: 'Annuler',
  })

  if (result.isConfirmed) {
    try {
      await deleteAgent(userId)
      await fetchAgents()
    } catch (error) {
      console.error(error)
    }
  }
}

//// Ajout de campagne
// Dans tes states
const campForm = reactive({
  campaignIds: [], // Changement : maintenant un tableau
})

async function giveCampagne(agent) {
  selectedAgentForCamp.value = agent

  // On initialise avec les campagnes actuelles de l'agent (on gère les objets ou les IDs)
  const currentCampaigns = agent.campaigns || []
  campForm.campaignIds = currentCampaigns.map((c) => c._id || c.id || c)

  const agentDeptId = agent.dept?._id || agent.dept?.id || agent.dept

  if (agentDeptId) {
    availableCampaignsForAgent.value = allCampaignsRaw.value.filter((c) => {
      return c.departement && c.departement.some((dep) => (dep._id || dep.id) === agentDeptId)
    })
  } else {
    availableCampaignsForAgent.value = []
    toast.warning("Cet agent n'est rattaché à aucun département.")
  }

  isCampModalOpen.value = true
}



async function handleUpdateAgentCampaign() {
  try {
    if (!selectedAgentForCamp.value) return

    // On envoie le tableau complet des IDs sélectionnés
    await updateAgent(selectedAgentForCamp.value._id, {
      campaigns: campForm.campaignIds,
    })

    toast.success('Campagnes mises à jour avec succès')
    await fetchAgents()
    isCampModalOpen.value = false
  } catch (error) {
    toast.error("Erreur lors de l'assignation")
  }
}


onMounted(initData)
</script>

<template>
  <main class="flex-1 lg:ml-64 p-4 lg:p-8 bg-slate-50 min-h-screen space-y-8 font-sans">
    <header class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div>
        <h1 class="text-3xl font-black text-slate-900 tracking-tight">Gestion des Agents</h1>
        <div class="flex items-center gap-2 mt-1">
          <span
            v-if="isChef"
            class="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-800 border border-purple-200"
          >
            Chef : {{ currentUser.dept?.name }}
          </span>
          <span
            v-else
            class="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200"
          >
            Administration Centrale
          </span>
        </div>
      </div>
      <button
        @click="isModalOpen = true"
        class="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-2xl transition-all shadow-lg text-sm font-bold"
      >
        <Plus class="w-5 h-5" /> Ajouter un Agent
      </button>
    </header>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <div
        v-for="stat in stats"
        :key="stat.title"
        class="group bg-white p-6 rounded-[24px] border border-slate-200 shadow-sm hover:shadow-md transition-all"
      >
        <div
          :class="[
            stat.bg,
            'p-3 w-fit rounded-2xl mb-4 group-hover:scale-110 transition-transform',
          ]"
        >
          <component :is="stat.icon" :class="['w-6 h-6', stat.color]" />
        </div>
        <p class="text-xs font-bold text-slate-400 uppercase tracking-widest">{{ stat.title }}</p>
        <h3 class="text-3xl font-black text-slate-900 mt-1 tracking-tighter">{{ stat.value }}</h3>
      </div>
    </div>

    <div class="bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden">
      <div class="p-6 border-b border-slate-100">
        <div class="relative max-w-md">
          <Search class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            v-model="search"
            @input="fetchAgents"
            type="text"
            placeholder="Rechercher un agent..."
            class="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:ring-2 focus:ring-slate-900 outline-none transition-all"
          />
        </div>
      </div>

      <div v-if="agents.length > 0" class="overflow-x-auto">
        <table class="w-full text-left">
          <thead>
            <tr class="bg-slate-50/50">
              <th class="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Agent
              </th>
              <th class="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Secteur
              </th>
              <th class="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Campagnes
              </th>
              <th
              class="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right"
              >
              Actions
            </th>
            <th class="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
              Accès digital
            </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-50">
            <tr
              v-for="agent in agents"
              :key="agent._id"
              class="hover:bg-slate-50/50 transition-colors group"
            >
              <td class="px-8 py-5">
                <div class="flex items-center gap-3">
                  <div class="relative">
                    <div
                      class="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-400 uppercase"
                    >
                      {{ agent.name.charAt(0) }}
                    </div>
                    <div
                      v-if="agent.haveCount"
                      class="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full"
                      title="Compte Digital Actif"
                    ></div>
                  </div>

                  <div>
                    <div class="flex items-center gap-2">
                      <p class="font-black text-slate-900 leading-none">{{ agent.name }}</p>
                      <span
                        v-if="agent.haveCount"
                        class="text-[9px] bg-emerald-50 animate-pulse text-emerald-600 px-1.5 py-0.5 rounded-md font-black uppercase tracking-tighter"
                      >
                        Digital actif
                      </span>
                      <span
                        v-else
                        class="text-[9px] bg-red-50 animate-pink text-red-500 px-1.5 py-0.5 rounded-md font-black uppercase tracking-tighter"
                      >
                        Digital inactif
                      </span>
                    </div>
                    <p class="text-xs text-slate-400 font-medium italic mt-1">{{ agent.email }}</p>
                  </div>
                </div>
              </td>
              <td class="px-8 py-5">
                <span
                  class="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-[10px] font-bold uppercase"
                  >{{ agent.dept?.name || 'Inconnu' }}</span
                >
              </td>

              <td class="px-8 py-5">
                <div class="flex items-center gap-2 text-slate-500">
                  <Briefcase class="w-3.5 h-3.5" />
                  <div
                    v-if="agent.campaigns && agent.campaigns.length"
                    class="flex items-center gap-1 flex-wrap"
                  >
                    <span
                      v-for="(camp, index) in agent.campaigns.slice(0, 2)"
                      :key="camp._id"
                      class="px-2 py-0.5 bg-blue-50 text-blue-600 rounded-md text-xs font-medium truncate max-w-[100px]"
                    >
                      {{ camp.name }}
                    </span>

                    <span v-if="agent.campaigns.length > 2" class="text-xs text-slate-400">
                      +{{ agent.campaigns.length - 2 }}
                    </span>
                  </div>
                  <button
                    v-else
                    @click="giveCampagne(agent)"
                    class="cursor-pointer border-lg border-green-500 text-green-500 text-xs font-semibold animate-pulse"
                  >
                    Ajouter une campagne
                  </button>
                </div>
              </td>
              <td class="px-8 py-5 text-right">
                <div class="flex justify-end gap-2">
                  <button
                    @click="openTodoModal(agent)"
                    v-if="agent.camp?.name"
                    class="p-2.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all"
                    title="Tâches"
                  >
                    <ClipboardList class="w-4 h-4" />
                  </button>
                  <button
                    @click="editing(agent)"
                    class="p-2.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                  >
                    <Edit2 class="w-4 h-4" />
                  </button>
                  <button
                    @click="handleDelete(agent._id)"
                    class="p-2.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                  >
                    <Trash2 class="w-4 h-4" />
                  </button>
                </div>
              </td>
              <!-- <td class="px-8 py-5">
                <button
                  @click="handleAgentDigital(agent._id, agent.haveCount = !agent.haveCount)"
                  class="p-2.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                >{{agent.haveCount? 'Restreindre': 'Authoriser' }}</button>
              </td> -->
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <Transition name="fade">
      <div v-if="isModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" @click="resetForm"></div>
        <div class="relative bg-white w-full max-w-xl rounded-[32px] shadow-2xl overflow-hidden">
          <div
            class="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/50"
          >
            <h2 class="text-2xl font-black text-slate-900">
              {{ toUpdate ? 'Modifier Agent' : 'Nouvel Agent' }}
            </h2>
            <button @click="resetForm" class="p-2 hover:bg-white rounded-full">
              <X class="w-5 h-5 text-slate-400" />
            </button>
          </div>
          <form @submit.prevent="handleSubmit" class="p-8 space-y-5">
            <div class="grid grid-cols-2 gap-5">
              <input
                v-model="newAgent.name"
                type="text"
                placeholder="Nom Complet"
                class="custom-input"
                required
              />
              <input
                v-model="newAgent.email"
                type="email"
                placeholder="Email Pro"
                class="custom-input"
                required
              />
            </div>
            <div class="grid grid-cols-2 gap-5">
              <input
                v-model="newAgent.num"
                type="tel"
                placeholder="Téléphone"
                class="custom-input"
                required
              />
              <input
                v-model="newAgent.poste"
                type="text"
                placeholder="Poste"
                class="custom-input"
                required
              />
            </div>
            <div class="grid grid-cols-1 gap-5">
              <select v-model="newAgent.dept" :disabled="isChef" class="custom-select" required>
                <option value="">Secteur / Département</option>
                <option v-for="d in departments" :key="d.id || d._id" :value="d.id || d._id">
                  {{ d.name }}
                </option>
              </select>

              <div class="space-y-2">
                <label class="text-xs font-black text-slate-500 uppercase ml-2"
                  >Assigner des campagnes ({{ newAgent.campaigns.length }})</label
                >

                <div
                  class="border border-slate-100 bg-slate-50/50 rounded-2xl p-4 max-h-48 overflow-y-auto grid grid-cols-2 gap-2"
                >
                  <div
                    v-for="c in campaigns"
                    :key="c._id || c.id"
                    @click="toggleCampaignInForm(c._id || c.id)"
                    :class="[
                      'flex items-center gap-2 p-3 rounded-xl border transition-all cursor-pointer text-xs font-bold',
                      newAgent.campaigns.includes(c._id || c.id)
                        ? 'bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-100'
                        : 'bg-white border-slate-100 text-slate-600 hover:border-slate-300',
                    ]"
                  >
                    <div class="flex-1 truncate">{{ c.name }}</div>
                    <CheckCircle2
                      v-if="newAgent.campaigns.includes(c._id || c.id)"
                      class="w-4 h-4"
                    />
                  </div>

                  <div
                    v-if="campaigns.length === 0"
                    class="col-span-2 text-center py-4 text-slate-400 text-xs italic"
                  >
                    Aucune campagne disponible pour ce secteur.
                  </div>
                </div>
              </div>
            </div>
            <div v-if="!isChef" class="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl">
              <input
                v-model="newAgent.haveCount"
                type="checkbox"
                id="hasAccount"
                class="w-4 h-4 accent-slate-900"
              />
              <label for="hasAccount" class="text-xs font-bold text-slate-700">Accès Digital</label>
            </div>
            <button
              type="submit"
              class="w-full py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-500 transition-all"
            >
              {{ toUpdate ? 'Mettre à jour' : 'Confirmer' }}
            </button>
          </form>
        </div>
      </div>
    </Transition>

    <Transition name="fade">
      <div v-if="isTodoModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          @click="isTodoModalOpen = false"
        ></div>
        <div
          class="relative bg-white w-full max-w-2xl rounded-[32px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        >
          <div
            class="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50"
          >
            <div>
              <h2 class="text-xl font-black text-slate-900">Tâches : {{ selectedAgent?.name }}</h2>
              <p class="text-xs text-slate-400 font-bold uppercase tracking-wider">
                Assignation et suivi en temps réel
              </p>
            </div>
            <button @click="isTodoModalOpen = false" class="p-2 hover:bg-white rounded-full">
              <X class="w-5 h-5 text-slate-400" />
            </button>
          </div>

          <div class="flex-1 overflow-y-auto p-6 space-y-6">
            <div class="bg-slate-50 p-5 rounded-2xl border border-slate-100 space-y-4">
              <h3 class="text-xs font-black uppercase text-slate-500 flex items-center gap-2">
                <Plus class="w-3 h-3" /> Nouvelle tâche
              </h3>
              <div class="grid grid-cols-1 gap-3">
                <input
                  v-model="newTodo.title"
                  type="text"
                  placeholder="Titre de la tâche (ex: Rappel vaccin)"
                  class="custom-input !bg-white"
                />
                <textarea
                  v-model="newTodo.description"
                  placeholder="Description..."
                  class="custom-input !bg-white min-h-[80px] py-3"
                ></textarea>
              </div>
              <div class="grid grid-cols-3 gap-3">
                <select v-model="newTodo.priority" class="custom-select !bg-white">
                  <option value="low">Basse</option>
                  <option value="medium">Moyenne</option>
                  <option value="high">Haute</option>
                </select>
                <input v-model="newTodo.dueDate" type="date" class="custom-select !bg-white" />
                <button
                  @click="handleAddTodo"
                  :disabled="!newTodo.title"
                  class="bg-blue-600 text-white rounded-xl font-bold text-xs disabled:opacity-50 hover:bg-blue-500"
                >
                  Ajouter
                </button>
              </div>
            </div>

            <div class="space-y-3">
              <h3 class="text-xs font-black uppercase text-slate-500">
                Tâches en cours ({{ agentTodos.length }})
              </h3>
              <div
                v-if="agentTodos.length === 0"
                class="text-center py-8 border-2 border-dashed border-slate-100 rounded-2xl"
              >
                <Clock class="w-8 h-8 text-slate-200 mx-auto mb-2" />
                <p class="text-sm text-slate-400 font-medium">Aucune tâche assignée</p>
              </div>

              <div
                v-for="todo in agentTodos"
                :key="todo._id"
                class="flex items-center justify-between p-4 rounded-2xl border transition-all"
                :class="
                  todo.status === 'completed'
                    ? 'bg-emerald-50/30 border-emerald-100 opacity-60'
                    : 'bg-white border-slate-100 shadow-sm'
                "
              >
                <div class="flex items-center gap-4">
                  <button @click="toggleTodoStatus(todo)" class="group">
                    <CheckCircle2
                      v-if="todo.status === 'completed'"
                      class="w-6 h-6 text-emerald-500"
                    />
                    <div
                      v-else
                      class="w-6 h-6 rounded-full border-2 border-slate-200 group-hover:border-slate-400 transition-colors"
                    ></div>
                  </button>
                  <div>
                    <h4
                      class="font-bold text-sm"
                      :class="
                        todo.status === 'completed'
                          ? 'line-through text-slate-400'
                          : 'text-slate-900'
                      "
                    >
                      {{ todo.title }}
                    </h4>
                    <div class="flex items-center gap-3 mt-1">
                      <span
                        class="text-[10px] font-bold px-2 py-0.5 rounded uppercase"
                        :class="{
                          'bg-rose-100 text-rose-600': todo.priority === 'high',
                          'bg-amber-100 text-amber-600': todo.priority === 'medium',
                          'bg-slate-100 text-slate-600': todo.priority === 'low',
                        }"
                        >{{ todo.priority }}</span
                      >
                      <span
                        v-if="todo.dueDate"
                        class="text-[10px] text-slate-400 flex items-center gap-1"
                      >
                        <Clock class="w-3 h-3" /> {{ new Date(todo.dueDate).toLocaleDateString() }}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  @click="deleteTodo(todo._id)"
                  class="p-2 text-slate-300 hover:text-rose-500 transition-colors"
                >
                  <Trash2 class="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <Transition
      name="fade"
      v-if="isCampModalOpen"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
    >
      <div class="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden">
        <div class="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <div>
            <h3 class="text-lg font-bold text-slate-800">Assigner des campagnes</h3>
            <p class="text-xs text-slate-500">Sélectionnez plusieurs options</p>
          </div>
          <button @click="isCampModalOpen = false" class="text-slate-400 hover:text-slate-600">
            <X class="w-5 h-5" />
          </button>
        </div>

        <div class="p-6 space-y-4 max-h-[400px] overflow-y-auto">
          <div class="bg-blue-50 p-3 rounded-lg flex gap-3 items-center mb-4">
            <div
              class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold"
            >
              {{ selectedAgentForCamp?.name.charAt(0) }}
            </div>
            <div>
              <p class="text-sm font-bold text-slate-800">{{ selectedAgentForCamp?.name }}</p>
              <p class="text-xs text-slate-500">
                {{ availableCampaignsForAgent.length }} campagne(s) disponible(s)
              </p>
            </div>
          </div>

          <div class="space-y-2">
            <div
              v-for="c in availableCampaignsForAgent"
              :key="c._id"
              class="flex items-center p-3 rounded-xl border transition-all cursor-pointer"
              :class="
                campForm.campaignIds.includes(c._id)
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-slate-100 hover:border-slate-200'
              "
              @click="toggleCampaign(c._id)"
            >
              <input
                type="checkbox"
                :value="c._id"
                v-model="campForm.campaignIds"
                class="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                @click.stop
              />
              <div class="ml-3 flex-1">
                <p class="text-sm font-semibold text-slate-700">{{ c.name }}</p>
                <p class="text-[10px] text-slate-400 uppercase font-bold">{{ c.status }}</p>
              </div>
            </div>
          </div>

          <div
            v-if="availableCampaignsForAgent.length === 0"
            class="text-center py-4 text-slate-400 text-sm italic"
          >
            Aucune campagne trouvée pour ce département.
          </div>
        </div>

        <div class="p-6 bg-slate-50 border-t border-slate-100 flex gap-3">
          <button
            @click="isCampModalOpen = false"
            class="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-white transition-all"
          >
            Annuler
          </button>
          <button
            @click="handleUpdateAgentCampaign"
            class="flex-1 px-4 py-2.5 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 shadow-md transition-all"
          >
            Enregistrer ({{ campForm.campaignIds.length }})
          </button>
        </div>
      </div>
    </Transition>
  </main>
</template>

<style scoped>
@import '@/assets/base.css';

.custom-input {
  width: 100%;
  padding: 0.75rem 1.25rem;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 0.75rem;
  font-size: 0.875rem;
  outline: none;
  transition: all 0.2s ease;
}

.custom-input:focus {
  box-shadow: 0 0 0 4px rgb(30 41 59 / 0.1);
  background: white;
  border-color: rgb(30 41 59);
}

.custom-select {
  width: 100%;
  padding: 0.75rem 1.25rem;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 0.75rem;
  font-size: 0.875rem;
  outline: none;
  appearance: none;
  cursor: pointer;
  transition: all 0.2s ease;
}

.custom-select:focus {
  background: white;
  border-color: rgb(30 41 59);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
