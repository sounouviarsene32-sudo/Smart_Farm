<script setup>
import { ref, computed, onMounted, reactive, watch } from 'vue'
import agentService from '@/services/agent.js'
import campaignService from '@/services/campaign.js'
import departementService from '@/services/departement.js'
import todoService from '@/services/todo.js'
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
  AlertCircle
} from 'lucide-vue-next'

// ================= USER & AUTH =================
const loginStore = useLoginStore()
const currentUser = ref(loginStore.getDecodedToken)
const isChef = computed(() => currentUser.value?.role === 'chef')
const isAdmin = computed(() => currentUser.value?.role === 'admin')

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

// État pour les Todos
const selectedAgent = ref(null)
const agentTodos = ref([])
const newTodo = reactive({
  title: '',
  description: '',
  priority: 'medium',
  dueDate: '',
  campaignId: ''
})

// ================= FORM STATE AGENT =================
const newAgent = reactive({
  name: '',
  email: '',
  poste: '',
  role: 'agent',
  dept: '',
  num: '',
  camp: '',
  haveCount: false,
})

// ================= LOAD DATA =================
async function initData() {
  try {
    const [deptsRes, campsRes] = await Promise.all([
      departementService.getDepartements(),
      campaignService.getCampaigns()
    ])
    departments.value = deptsRes.data || deptsRes
    allCampaignsRaw.value = campsRes.data || campsRes


    if (isChef.value && currentUser.value.dept) {
      newAgent.dept = currentUser.value.dept.id || currentUser.value.dept.id
      filterCampaignsByDept(newAgent.dept)
    } else {
      campaigns.value = allCampaignsRaw.value
    }

    await fetchAgents()
  } catch (error) {
    console.error("Erreur initialisation:", error)
  }
}

async function fetchAgents() {
  try {
    const res = await agentService.getAllAgents({
      page: 1,
      limit: 50,
      search: search.value,
    })

    const allItems = res.data.items || res.data
    if (isChef.value) {
      agents.value = allItems.filter(a => a.dept?.name === currentUser.value.dept?.name)
    } else {
      agents.value = allItems
    }
    
    updateStats()
  } catch (error) {
    console.error("Erreur agents:", error)
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
    console.error("Erreur todos:", error)
  }
}

async function handleAddTodo() {
  try {
    await todoService.createTodo({
      ...newTodo,
      agentId: selectedAgent.value._id,
      campaignId: newTodo.campaignId || selectedAgent.value.camp?._id
    })
    // Reset form todo
    newTodo.title = ''
    newTodo.description = ''
    await fetchAgentTodos(selectedAgent.value._id)
  } catch (error) {
    console.error("Erreur ajout todo:", error)
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
  if(confirm("Supprimer cette tâche ?")) {
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
  campaigns.value = allCampaignsRaw.value.filter(c => {
    // departement est un tableau d'objets peuplés (après populate)
    const isIncluded = c.departement && c.departement.some(dep => (dep._id || dep.id) === deptId)
    return isIncluded
  })
}

watch(() => newAgent.dept, (newVal) => filterCampaignsByDept(newVal))

function updateStats() {
  stats.value = [
    { title: 'Total Agents', value: agents.value.length, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { title: 'Agents Actifs', value: agents.value.filter((a) => a.isActive).length, icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { title: 'Départements', value: departments.value.length, icon: Medal, color: 'text-orange-500', bg: 'bg-orange-50' },
    { title: 'Campagnes Dept', value: campaigns.value.length, icon: TrendingUp, color: 'text-purple-500', bg: 'bg-purple-50' },
  ]
}

console.log(currentUser.value)

// ================= CRUD AGENT =================
const resetForm = () => {
  Object.assign(newAgent, {
    name: '', email: '', poste: '', role: 'agent',
    dept: isChef.value
      ? (currentUser.value.dept?._id || currentUser.value.dept?.id || currentUser.value.dept || '')
      : '',
    num: '', camp: '', haveCount: false,
  })
  isModalOpen.value = false
  toUpdate.value = null
}

const handleSubmit = async () => {
  try {
    if (toUpdate.value) {
      await agentService.updateAgent(toUpdate.value._id, newAgent)
    } else {
      await agentService.addAgent(newAgent)
    }
    await fetchAgents()
    resetForm()
  } catch (error) { console.error(error) }
}

function editing(user) {
  toUpdate.value = user
  Object.assign(newAgent, {
    name: user.name, email: user.email, poste: user.poste, role: 'agent',
    dept: user.dept?._id || user.dept || '',
    num: user.num, camp: user.camp?._id || user.camp || '',
    haveCount: user.haveCount,
  })
  isModalOpen.value = true
}

const handleDelete = async (userId) => {
  if (confirm("Supprimer cet agent ?")) {
    try {
      await agentService.deleteAgent(userId)
      await fetchAgents()
    } catch (error) { console.error(error) }
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
          <span v-if="isChef" class="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-800 border border-purple-200">
            Chef : {{ currentUser.dept?.name }}
          </span>
          <span v-else class="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200">
            Administration Centrale
          </span>
        </div>
      </div>
      <button @click="isModalOpen = true" class="inline-flex items-center gap-2 bg-slate-950 hover:bg-slate-800 text-white px-6 py-3 rounded-2xl transition-all shadow-lg text-sm font-bold">
        <Plus class="w-5 h-5" /> Ajouter un Agent
      </button>
    </header>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <div v-for="stat in stats" :key="stat.title" class="group bg-white p-6 rounded-[24px] border border-slate-200 shadow-sm hover:shadow-md transition-all">
        <div :class="[stat.bg, 'p-3 w-fit rounded-2xl mb-4 group-hover:scale-110 transition-transform']">
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
          <input v-model="search" @input="fetchAgents" type="text" placeholder="Rechercher un agent..." class="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:ring-2 focus:ring-slate-900 outline-none transition-all" />
        </div>
      </div>

      <div v-if="agents.length > 0" class="overflow-x-auto">
        <table class="w-full text-left">
          <thead>
            <tr class="bg-slate-50/50">
              <th class="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Agent</th>
              <th class="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Secteur</th>
              <th class="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Campagne</th>
              <th class="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-50">
            <tr v-for="agent in agents" :key="agent._id" class="hover:bg-slate-50/50 transition-colors group">
              <td class="px-8 py-5">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-400 uppercase">
                    {{ agent.name.charAt(0) }}
                  </div>
                  <div>
                    <p class="font-black text-slate-900 leading-none mb-1">{{ agent.name }}</p>
                    <p class="text-xs text-slate-400 font-medium italic">{{ agent.email }}</p>
                  </div>
                </div>
              </td>
              <td class="px-8 py-5">
                <span class="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-[10px] font-bold uppercase">{{ agent.dept?.name || 'Inconnu' }}</span>
              </td>
              <td class="px-8 py-5">
                <div class="flex items-center gap-2 text-slate-500">
                  <Briefcase class="w-3.5 h-3.5" />
                  <span class="text-xs font-semibold">{{ agent.camp?.name || 'Libre' }}</span>
                </div>
              </td>
              <td class="px-8 py-5 text-right">
                <div class="flex justify-end gap-2">
                  <button @click="openTodoModal(agent)" class="p-2.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all" title="Tâches">
                    <ClipboardList class="w-4 h-4" />
                  </button>
                  <button @click="editing(agent)" class="p-2.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"><Edit2 class="w-4 h-4" /></button>
                  <button @click="handleDelete(agent._id)" class="p-2.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"><Trash2 class="w-4 h-4" /></button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <Transition name="fade">
      <div v-if="isModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" @click="resetForm"></div>
        <div class="relative bg-white w-full max-w-xl rounded-[32px] shadow-2xl overflow-hidden">
          <div class="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
            <h2 class="text-2xl font-black text-slate-900">{{ toUpdate ? 'Modifier Agent' : 'Nouvel Agent' }}</h2>
            <button @click="resetForm" class="p-2 hover:bg-white rounded-full"><X class="w-5 h-5 text-slate-400" /></button>
          </div>
          <form @submit.prevent="handleSubmit" class="p-8 space-y-5">
            <div class="grid grid-cols-2 gap-5">
              <input v-model="newAgent.name" type="text" placeholder="Nom Complet" class="custom-input" required />
              <input v-model="newAgent.email" type="email" placeholder="Email Pro" class="custom-input" required />
            </div>
            <div class="grid grid-cols-2 gap-5">
              <input v-model="newAgent.num" type="tel" placeholder="Téléphone" class="custom-input" required />
              <input v-model="newAgent.poste" type="text" placeholder="Poste" class="custom-input" required />
            </div>
            <div class="grid grid-cols-2 gap-5">
              <select v-model="newAgent.dept" :disabled="isChef" class="custom-select" required>
                <option value="">Secteur</option>
                <option
                  v-for="d in departments"
                  :key="d.id || d._id"
                  :value="d.id || d._id"
                >
                  {{ d.name }}
                </option>
              </select>
              <select v-model="newAgent.camp" class="custom-select">
                <option value="">Campagne</option>
                <option
                  v-for="c in campaigns"
                  :key="c._id || c.id"
                  :value="c._id || c.id"
                >
                  {{ c.name }}
                </option>
              </select>
            </div>
            <div v-if="!isChef" class="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl">
              <input v-model="newAgent.haveCount" type="checkbox" id="hasAccount" class="w-4 h-4 accent-slate-900" />
              <label for="hasAccount" class="text-xs font-bold text-slate-700">Accès Digital</label>
            </div>
            <button type="submit" class="w-full py-4 bg-slate-950 text-white font-bold rounded-2xl hover:bg-slate-800 transition-all">
              {{ toUpdate ? 'Mettre à jour' : 'Confirmer' }}
            </button>
          </form>
        </div>
      </div>
    </Transition>

    <Transition name="fade">
      <div v-if="isTodoModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" @click="isTodoModalOpen = false"></div>
        <div class="relative bg-white w-full max-w-2xl rounded-[32px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
          
          <div class="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <div>
              <h2 class="text-xl font-black text-slate-900">Tâches : {{ selectedAgent?.name }}</h2>
              <p class="text-xs text-slate-400 font-bold uppercase tracking-wider">Assignation et suivi en temps réel</p>
            </div>
            <button @click="isTodoModalOpen = false" class="p-2 hover:bg-white rounded-full"><X class="w-5 h-5 text-slate-400" /></button>
          </div>

          <div class="flex-1 overflow-y-auto p-6 space-y-6">
            <div class="bg-slate-50 p-5 rounded-2xl border border-slate-100 space-y-4">
              <h3 class="text-xs font-black uppercase text-slate-500 flex items-center gap-2">
                <Plus class="w-3 h-3" /> Nouvelle tâche
              </h3>
              <div class="grid grid-cols-1 gap-3">
                <input v-model="newTodo.title" type="text" placeholder="Titre de la tâche (ex: Rappel vaccin)" class="custom-input !bg-white" />
                <textarea v-model="newTodo.description" placeholder="Description..." class="custom-input !bg-white min-h-[80px] py-3"></textarea>
              </div>
              <div class="grid grid-cols-3 gap-3">
                <select v-model="newTodo.priority" class="custom-select !bg-white">
                  <option value="low">Basse</option>
                  <option value="medium">Moyenne</option>
                  <option value="high">Haute</option>
                </select>
                <input v-model="newTodo.dueDate" type="date" class="custom-select !bg-white" />
                <button @click="handleAddTodo" :disabled="!newTodo.title" class="bg-slate-950 text-white rounded-xl font-bold text-xs disabled:opacity-50">Ajouter</button>
              </div>
            </div>

            <div class="space-y-3">
              <h3 class="text-xs font-black uppercase text-slate-500">Tâches en cours ({{ agentTodos.length }})</h3>
              <div v-if="agentTodos.length === 0" class="text-center py-8 border-2 border-dashed border-slate-100 rounded-2xl">
                <Clock class="w-8 h-8 text-slate-200 mx-auto mb-2" />
                <p class="text-sm text-slate-400 font-medium">Aucune tâche assignée</p>
              </div>
              
              <div v-for="todo in agentTodos" :key="todo._id" 
                class="flex items-center justify-between p-4 rounded-2xl border transition-all"
                :class="todo.status === 'completed' ? 'bg-emerald-50/30 border-emerald-100 opacity-60' : 'bg-white border-slate-100 shadow-sm'"
              >
                <div class="flex items-center gap-4">
                  <button @click="toggleTodoStatus(todo)" class="group">
                    <CheckCircle2 v-if="todo.status === 'completed'" class="w-6 h-6 text-emerald-500" />
                    <div v-else class="w-6 h-6 rounded-full border-2 border-slate-200 group-hover:border-slate-400 transition-colors"></div>
                  </button>
                  <div>
                    <h4 class="font-bold text-sm" :class="todo.status === 'completed' ? 'line-through text-slate-400' : 'text-slate-900'">{{ todo.title }}</h4>
                    <div class="flex items-center gap-3 mt-1">
                      <span class="text-[10px] font-bold px-2 py-0.5 rounded uppercase" 
                        :class="{
                          'bg-rose-100 text-rose-600': todo.priority === 'high',
                          'bg-amber-100 text-amber-600': todo.priority === 'medium',
                          'bg-slate-100 text-slate-600': todo.priority === 'low',
                        }">{{ todo.priority }}</span>
                      <span v-if="todo.dueDate" class="text-[10px] text-slate-400 flex items-center gap-1">
                        <Clock class="w-3 h-3" /> {{ new Date(todo.dueDate).toLocaleDateString() }}
                      </span>
                    </div>
                  </div>
                </div>
                <button @click="deleteTodo(todo._id)" class="p-2 text-slate-300 hover:text-rose-500 transition-colors">
                  <Trash2 class="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>

  </main>
</template>

<style scoped>
@reference "@/assets/base.css"; 

.custom-input {
  @apply w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm outline-none focus:ring-4 focus:ring-slate-950/5 focus:bg-white focus:border-slate-950 transition-all;
}

.custom-select {
  @apply w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm outline-none appearance-none focus:bg-white focus:border-slate-950 transition-all cursor-pointer;
}

.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>