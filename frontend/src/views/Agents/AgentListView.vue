<script setup>
import { ref, computed, onMounted, reactive } from 'vue'
import agentService from '@/services/agent.js'
import campaignService from '@/services/campaign.js'
import departementService from '@/services/departement.js'
import { useLoginStore } from '@/stores/login.store'

import {
  Users,
  CheckCircle2,
  Medal,
  TrendingUp,
  Search,
  Plus,
  Mail,
  Phone,
  Edit2,
  Trash2,
} from 'lucide-vue-next'

// ================= USER =================
const loginStore = useLoginStore()
const currentUser = ref(loginStore.getDecodedToken)

const isChef = computed(() => currentUser.value?.role === 'chef')

// ================= STATES =================
const isModalOpen = ref(false)
const agents = ref([])
const campaigns = ref([])
const departments = ref([])
const toUpdate = ref(null)
const stats = ref([])
const search = ref('')

// ================= LOAD DATA =================
async function allCampDepart() {
  try {
    const campaignsData = await campaignService.getCampaigns()
    campaigns.value = campaignsData.data || campaignsData

    const departmentsData = await departementService.getDepartements()
    departments.value = departmentsData.data || departmentsData
  } catch (error) {
    console.error(error)
  }
}

async function allAgent() {
  try {
    const res = await agentService.getAllAgents({
      page: 1,
      limit: 10,
      search: search.value,
    })

    const allAgents = res.data.items

    // 🔥 FILTRAGE CHEF
    if (isChef.value) {
      agents.value = allAgents.filter(
        (agent) => agent.dept?._id === currentUser.value.dept
      )
    } else {
      agents.value = allAgents
    }

    // 🔥 STATS CORRIGÉES
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
        title: 'Tâches Complétées',
        value: '1100',
        icon: Medal,
        color: 'text-orange-500',
        bg: 'bg-orange-50',
      },
      {
        title: 'Performance Moy.',
        value: '86.4%',
        icon: TrendingUp,
        color: 'text-purple-500',
        bg: 'bg-purple-50',
      },
    ]
  } catch (error) {
    console.error(error)
  }
}

// ================= FORM =================
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

const resetForm = () => {
  Object.assign(newAgent, {
    name: '',
    email: '',
    poste: '',
    role: 'agent',
    dept: '',
    num: '',
    camp: '',
    haveCount: false,
  })
  isModalOpen.value = false
}

// ================= CRUD =================
function handleCreateUser() {
  agentService
    .addAgent(newAgent)
    .then(() => allAgent())
    .catch(console.error)

  resetForm()
}

function editing(user) {
  Object.assign(newAgent, {
    name: user.name,
    email: user.email,
    role: 'agent',
    dept: user.dept?._id || '',
    num: user.num,
    camp: user.camp,
    haveCount: user.haveCount,
  })
  isModalOpen.value = true
  toUpdate.value = user
}

const handleEdit = async (user) => {
  try {
    await agentService.updateAgent(user._id, newAgent)
    allAgent()
    isModalOpen.value = false
  } catch (error) {
    console.error(error)
  }
}

const handleDelete = async (userId) => {
  try {
    await agentService.deleteAgent(userId)
    allAgent()
  } catch (error) {
    console.error(error)
  }
}

// ================= HELPERS =================
const getPerfClass = (perf) => {
  if (perf === 'Excellent') return 'bg-emerald-500 text-white'
  if (perf === 'Très Bon') return 'bg-blue-500 text-white'
  return 'bg-slate-500 text-white'
}

const handleSubmit = () => {
  if (toUpdate.value) {
    handleEdit(toUpdate.value)
  } else {
    handleCreateUser()
  }
}

// ================= LIFECYCLE =================
onMounted(allAgent)
onMounted(allCampDepart)
</script>

<template>
  <main class="flex-1 lg:ml-64 p-4 lg:p-8 bg-slate-50 min-h-screen space-y-8">
    
    <header class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div>
        <h1 class="text-3xl font-extrabold text-slate-900 tracking-tight">Gestion des Agents</h1>
        <div class="flex items-center gap-2 mt-1">
          <span v-if="isChef" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
            Chef de département : {{ currentUser.dept?.name || 'Chargement...' }}
          </span>
          <p class="text-slate-500 text-sm">Consultez et gérez les performances de vos équipes.</p>
        </div>
      </div>

      <button
        @click="isModalOpen = true"
        class="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl transition-all shadow-sm text-sm font-semibold"
      >
        <Plus class="w-4 h-4" /> Ajouter un Agent
      </button>
    </header>

    <Transition name="fade">
      <div v-if="isModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" @click="resetForm"></div>

        <div
          class="relative bg-white w-full max-w-lg rounded-lg shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in duration-200"
        >
          <div class="p-8 border-b border-slate-50 flex justify-between items-center">
            <div>
              <h2 class="text-xl font-black text-slate-900">Nouvel Utilisateur</h2>
              <p class="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">
                SmartFarm Access
              </p>
            </div>
            <button @click="resetForm" class="p-2 hover:bg-slate-50 rounded-full transition-colors">
              <X class="w-5 h-5 text-slate-400" />
            </button>
          </div>

          <form @submit.prevent="handleSubmit" class="p-8 space-y-6">
            <div class="space-y-2">
              <label class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1"
                >Nom Complet</label
              >
              <input
                v-model="newAgent.name"
                type="text"
                placeholder="Ex: Amadou Diallo"
                class="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm outline-none focus:ring-4 focus:ring-slate-950/5 focus:bg-white focus:border-slate-950 transition-all"
                required
              />
            </div>

            <div class="space-y-2">
              <label class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1"
                >Adresse Email Professionnelle</label
              >
              <div class="relative">
                <Mail class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                <input
                  v-model="newAgent.email"
                  type="email"
                  placeholder="nom@smartfarm.com"
                  class="w-full pl-12 pr-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm outline-none focus:ring-4 focus:ring-slate-950/5 focus:bg-white focus:border-slate-950 transition-all"
                  required
                />
              </div>
            </div>
            <div class="space-y-2">
              <label class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1"
                >Numéro de Téléphone</label
              >
              <div class="relative">
                <Mail class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                <input
                  v-model="newAgent.num"
                  type="tel"
                  placeholder="01 23 45 67 89"
                  class="w-full pl-12 pr-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm outline-none focus:ring-4 focus:ring-slate-950/5 focus:bg-white focus:border-slate-950 transition-all"
                  required
                />
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-2">
                <label class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1"
                  >Département</label
                >
                <select
                  v-model="newAgent.dept"
                  class="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm outline-none appearance-none focus:bg-white focus:border-slate-950 transition-all cursor-pointer"
                >
                  <option value="">Sélectionner un département</option>
                  <option
                    v-for="department in departments"
                    :key="department.id"
                    :value="department.id"
                  >
                    {{ department.name }}
                  </option>
                </select>
              </div>
              <div class="space-y-2">
                <label class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1"
                  >Campagnes</label
                >
                <select
                  v-model="newAgent.camp"
                  class="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm outline-none appearance-none focus:bg-white focus:border-slate-950 transition-all cursor-pointer"
                >
                  <option value="">Sélectionner une campagne</option>
                  <option v-for="campaign in campaigns" :key="campaign._id" :value="campaign._id">
                    {{ campaign.name }}
                  </option>
                </select>
              </div>
            </div>

            <div class="space-y-2">
              <label class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1"
                >Poste à occupper</label
              >
              <div class="relative">
                <Mail class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                <input
                  v-model="newAgent.poste"
                  type="tel"
                  placeholder="Bouvier, Vétérinaire..."
                  class="w-full pl-12 pr-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm outline-none focus:ring-4 focus:ring-slate-950/5 focus:bg-white focus:border-slate-950 transition-all"
                  required
                />
              </div>
            </div>
            <input
              v-model="newAgent.haveCount"
              type="checkbox"
              class="inline"
              name="campagne"
              id="campagne"
            />
            <samp for="campagne" class="text-xs font-black uppercase tracking-[0.2em] ml-1"
              >Créer directement un compte</samp
            >

            <div class="flex gap-3 pt-4">
              <button
                type="button"
                @click="resetForm"
                class="flex-1 py-4 text-sm font-bold text-slate-500 hover:bg-slate-50 rounded-2xl transition-all"
              >
                Annuler
              </button>
              <button
                type="submit"
                class="flex-1 py-4 bg-slate-950 text-white text-sm font-bold rounded-2xl hover:bg-slate-800 transition-all shadow-lg shadow-slate-100 active:scale-95"
              >
                Confirmer l'ajout
              </button>
            </div>
          </form>
        </div>
      </div>
    </Transition>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <div
        v-for="stat in stats"
        :key="stat.title"
        class="group bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow"
      >
        <div class="flex justify-between items-start">
          <div :class="[stat.bg, 'p-2.5 rounded-xl transition-colors']">
            <component :is="stat.icon" :class="['w-5 h-5', stat.color]" />
          </div>
        </div>
        <div class="mt-4">
          <p class="text-sm font-medium text-slate-500">{{ stat.title }}</p>
          <h3 class="text-2xl font-bold text-slate-900 mt-1">{{ stat.value }}</h3>
        </div>
      </div>
    </div>

    <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      
      <div class="p-4 border-b border-slate-100 flex flex-col md:flex-row justify-between gap-4 bg-white">
        <div class="relative w-full md:w-96">
          <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            v-model="search"
            @input="allAgent"
            type="text" 
            placeholder="Rechercher un nom ou un email..."
            class="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-slate-900 focus:outline-none transition-all"
          />
        </div>
      </div>

      <div v-if="agents.length > 0" class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-slate-50/50">
              <th class="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Agent</th>
              <th class="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Département</th>
              <th class="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Poste</th>
              <th class="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Statut</th>
              <th class="px-6 py-4 text-xs font-semibold text-slate-500 uppercase text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr v-for="agent in agents" :key="agent._id" class="hover:bg-slate-50/50 transition-colors group">
              <td class="px-6 py-4">
                <div class="flex flex-col">
                  <span class="font-bold text-slate-900">{{ agent.name }}</span>
                  <span class="text-xs text-slate-500">{{ agent.email }}</span>
                </div>
              </td>
              <td class="px-6 py-4 text-sm text-slate-600">
                {{ agent.dept?.name || 'Non assigné' }}
              </td>
              <td class="px-6 py-4">
                 <span class="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded">
                   {{ agent.poste || 'Général' }}
                 </span>
              </td>
              <td class="px-6 py-4">
                <span 
                  :class="agent.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'"
                  class="inline-flex items-center px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider"
                >
                  {{ agent.isActive ? 'Actif' : 'Inactif' }}
                </span>
              </td>
              <td class="px-6 py-4 text-right">
                <div class="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button @click="editing(agent)" class="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                    <Edit2 class="w-4 h-4" />
                  </button>
                  <button @click="handleDelete(agent._id)" class="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors">
                    <Trash2 class="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-else class="flex flex-col items-center justify-center py-20 px-4">
        <div class="bg-slate-100 p-6 rounded-full mb-4">
          <Users class="w-12 h-12 text-slate-300" />
        </div>
        <h3 class="text-lg font-bold text-slate-900">Aucun agent trouvé</h3>
        <p class="text-slate-500 text-center max-w-sm mt-2">
          {{ search ? `Aucun résultat pour "${search}". Essayez un autre terme.` : "Commencez par ajouter votre premier agent à l'équipe." }}
        </p>
        <button v-if="!search" @click="isModalOpen = true" class="mt-6 text-blue-600 font-semibold hover:underline">
          Ajouter un membre maintenant
        </button>
      </div>
    </div>

    <div v-if="agents.length > 0" class="flex justify-between items-center px-2">
      <p class="text-sm text-slate-500">Affichage de {{ agents.length }} agents</p>
    </div>

  </main>
</template>