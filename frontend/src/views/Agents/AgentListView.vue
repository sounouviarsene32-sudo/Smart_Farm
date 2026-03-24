<script setup>
import { ref, computed, onMounted, reactive } from 'vue'
import agentService from '@/services/agent.js'
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
import campaignService from '@/services/campaign.js'
import departement from "@/services/";
// Données des agents
const isModalOpen = ref(false)
const agents = ref([])
const campaigns = ref([])

async function allCampaigns() {
  try {
    const data = await campaignService.getCampaigns()
    campaigns.value = data
    console.log(campaigns.value)
  } catch (error) {
    console.error(error)
  }
}
allCampaigns()

const search = ref('')
// Statistiques du haut
const stats = ref()
async function allAgent() {
  try {
    // Si role === 'Tous les rôles', on envoie une chaîne vide
    const res = await agentService.getAllAgents({
      page: 1,
      limit: 10,
      search: search.value,
    })
    agents.value = res.data.items
    stats.value = [
      {
        title: 'Total Agents',
        value: res.data.total,
        icon: Users,
        color: 'text-blue-600',
        bg: 'bg-blue-50',
      },
      {
        title: 'Agents Actifs',
        value: res.data.items.filter((agent) => agent.statut).length,
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

const toUpdate = ref(null)
const newUser = reactive({
  name: '',
  email: '',
  role: 'agent',
  dept: '',
  num: '',
  haveCount: false,
})

const départements = ['-', 'Volaille', 'Bovins', 'Caprins', 'Ovins']

const resetForm = () => {
  newUser.name = ''
  newUser.email = ''
  newUser.role = 'agent'
  newUser.dept = ''
  newUser.num = ''
  newUser.haveCount = false
  isModalOpen.value = false
}

// Logique d'ajout
function handleCreateUser() {
  agentService
    .addAgent(newUser)
    .then((response) => {
      allAgent()
    })
    .catch((error) => {
      console.error("Erreur lors de la création de l'utilisateur:", error)
    })
  resetForm()
}

// modifier
function editing(user) {
  newUser.name = user.name
  newUser.email = user.email
  newUser.role = user.role
  newUser.dept = user.dept
  newUser.num = user.num
  newUser.haveCount = user.haveCount
  isModalOpen.value = true
  toUpdate.value = user
}
const handleEdit = async (user) => {
  // Logique de modification
  agentService
    .updateAgent(user._id, newUser)
    .then((response) => {
      allAgent()
      isModalOpen.value = false
    })
    .catch((error) => {
      console.error("Erreur lors de la modification de l'utilisateur:", error)
    })
}

// Helper pour les couleurs de performance
const getPerfClass = (perf) => {
  if (perf === 'Excellent') return 'bg-emerald-500 text-white'
  if (perf === 'Très Bon') return 'bg-blue-500 text-white'
  return 'bg-slate-500 text-white'
}
onMounted(allAgent)
</script>
<template>
  <main
    class="flex-1 lg:ml-64 p-4 lg:p-8 transition-all duration-300 w-full bg-red-50 min-h-screen space-y-8"
  >
    <div class="flex justify-between items-start mb-8">
      <div>
        <h1 class="text-3xl font-bold text-slate-900">Agents</h1>
        <p class="text-slate-500 text-sm">Gestion de tous les agents terrain</p>
      </div>
      <button
        @click="isModalOpen = true"
        class="bg-slate-950 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium"
      >
        <Plus class="w-4 h-4" /> Ajouter un Agent
      </button>
    </div>

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
                v-model="newUser.name"
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
                  v-model="newUser.email"
                  type="email"
                  placeholder="nom@smartfarm.com"
                  class="w-full pl-12 pr-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm outline-none focus:ring-4 focus:ring-slate-950/5 focus:bg-white focus:border-slate-950 transition-all"
                  required
                />
              </div>
            </div>

            <div class="grid grid-cols-1 gap-4">
              <div class="space-y-2">
                <label class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1"
                  >Département</label
                >
                <select
                  v-model="newUser.dept"
                  class="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm outline-none appearance-none focus:bg-white focus:border-slate-950 transition-all cursor-pointer"
                >
                  <option></option>
                </select>
              </div>
              <div class="space-y-2">
                <label class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1"
                  >Campagnes</label
                >
                <select
                  v-model="newUser.dept"
                  class="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm outline-none appearance-none focus:bg-white focus:border-slate-950 transition-all cursor-pointer"
                >
                  <option></option>
                </select>
              </div>
            </div>
            <input
              v-model="newUser.haveCount"
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

    <div class="grid grid-cols-4 gap-6 mb-8">
      <div
        v-for="stat in stats"
        :key="stat.title"
        class="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm"
      >
        <div class="flex justify-between items-start mb-4">
          <span class="text-sm font-medium text-slate-500">{{ stat.title }}</span>
          <div :class="[stat.bg, stat.color, 'p-2 rounded-lg']">
            <component :is="stat.icon" class="w-5 h-5" />
          </div>
        </div>
        <div class="text-2xl font-bold text-slate-900">{{ stat.value }}</div>
      </div>
    </div>

    <div class="flex gap-4 mb-6">
      <div class="relative flex-1">
        <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Rechercher par nom ou email..."
          class="w-full pl-10 pr-4 py-2.5 bg-slate-100 border-none rounded-xl text-sm focus:ring-2 focus:ring-slate-200 outline-none"
        />
      </div>
      <select
        class="bg-slate-100 border-none rounded-xl px-4 py-2.5 text-sm text-slate-600 outline-none min-w-[200px]"
      >
        <option>Tous les départements</option>
      </select>
    </div>

    <div class="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <div class="p-6 border-b border-slate-50">
        <h2 class="font-bold text-slate-800">Liste des Agents ({{ agents.length }})</h2>
      </div>

      <table class="w-full text-left border-collapse">
        <thead>
          <tr class="text-slate-400 text-xs uppercase tracking-wider border-b border-slate-50">
            <th class="px-6 py-4 font-semibold">Agent</th>
            <th class="px-6 py-4 font-semibold">Contact</th>
            <th class="px-6 py-4 font-semibold">Département</th>
            <th class="px-6 py-4 font-semibold">Rôle</th>
            <th class="px-6 py-4 font-semibold text-center">Tâches</th>
            <th class="px-6 py-4 font-semibold text-center">Performance</th>
            <th class="px-6 py-4 font-semibold text-center">Statut</th>
            <th class="px-6 py-4 font-semibold text-right">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-50">
          <tr
            v-for="agent in agents"
            :key="agent.id"
            class="hover:bg-slate-50/50 transition-colors"
          >
            <td class="px-6 py-4">
              <div class="font-bold text-slate-900">{{ agent.nom }}</div>
              <div class="text-xs text-slate-400">Depuis {{ agent.date }}</div>
            </td>
            <td class="px-6 py-4">
              <div class="flex items-center gap-2 text-xs text-slate-500 mb-1">
                <Mail class="w-3.5 h-3.5 text-slate-300" /> {{ agent.email }}
              </div>
              <div class="flex items-center gap-2 text-xs text-slate-500">
                <Phone class="w-3.5 h-3.5 text-slate-300" /> {{ agent.num }}
              </div>
            </td>
            <td class="px-6 py-4">
              <span
                class="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-[11px] font-bold border border-slate-200"
              >
                {{ agent.dept }}
              </span>
            </td>
            <td class="px-6 py-4 text-sm text-slate-500">{{ agent.poste }}</td>
            <td class="px-6 py-4 text-center font-bold text-slate-700">{{ agent.taches }}</td>
            <td class="px-6 py-4 text-center">
              <span
                :class="[
                  getPerfClass(agent.perf),
                  'px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tighter',
                ]"
              >
                {{ agent.perf }}
              </span>
            </td>
            <td class="px-6 py-4 text-center">
              <span
                class="bg-emerald-500 text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase"
              >
                {{ agent.statut }}
              </span>
            </td>
            <td class="px-6 py-4 text-right">
              <div class="flex justify-end gap-2">
                <button
                  class="p-1.5 border border-slate-200 rounded-lg hover:bg-slate-100 text-slate-500"
                >
                  <Edit2 class="w-4 h-4" />
                </button>
                <button
                  class="p-1.5 border border-rose-100 rounded-lg hover:bg-rose-50 text-rose-500"
                >
                  <Trash2 class="w-4 h-4" />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </main>
</template>
