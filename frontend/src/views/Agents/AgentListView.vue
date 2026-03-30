<script setup>
import { ref, reactive, onMounted, watch } from 'vue'
import userService from '@/services/users'
import departementService from '@/services/departement.js'
import Swal from 'sweetalert2'
import { useToast } from 'vue-toastification'
import {
  Users,
  CheckCircle2,
  UserCog,
  Briefcase,
  Search,
  Plus,
  Mail,
  Phone,
  X,
  UserCircle,
  Edit2,
} from 'lucide-vue-next'

// --- États ---
const isModalOpen = ref(false)
const agents = ref([])
const role = ref('agent') // Filtrage par défaut
const search = ref('')
const departments = ref([])
const stats = ref([])
const toUpdate = ref(null)
const toast = useToast()

// --- Formulaire Réactif ---
const newAgent = reactive({
  name: '',
  email: '',
  num: '',
  dept: '',
  role: 'agent',
  password: ''
})

// --- Chargement des données ---
async function fetchAgents() {
  try {
    const res = await userService.getUsers({
      page: 1,
      limit: 50,
      search: search.value,
      role: 'agent'
    })
    
    agents.value = res.data.items.filter(a => a.isActive) || []
    
    const deptsRes = await departementService.getDepartements()
    departments.value = deptsRes.data || deptsRes

    // Stats dynamiques
    stats.value = [
      {
        title: 'Total Agents',
        value: res.data.total || agents.value.length,
        icon: Users,
        color: 'text-emerald-600',
      },
      // {
      //   title: 'En Mission',
      //   value: agents.value.filter(a => a.campaigns?.length > 0).length,
      //   icon: Briefcase,
      //   color: 'text-blue-600',
      // },
      {
        title: 'Disponibles',
        value: agents.value.filter(a => a.isActive).length,
        icon: CheckCircle2,
        color: 'text-emerald-500',
      },
      {
        title: 'Rôle',
        value: 'Agent terrain',
        icon: UserCog,
        color: 'text-slate-500',
      },
    ]
  } catch (error) {
    console.error('Erreur chargement agents:', error)
  }
}

const resetForm = () => {
  Object.assign(newAgent, { name: '', email: '', num: '', dept: '', password: '' })
  toUpdate.value = null
  isModalOpen.value = false
}

const handleSubmit = async () => {
  try {
    const payload = { ...newAgent }
    if (!payload.password) delete payload.password

    if (toUpdate.value) {
      await userService.updateUser(toUpdate.value._id, payload)
      toast.success('Agent mis à jour')
    } else {
      await userService.register(payload)
      toast.success('Agent créé avec succès')
    }
    await fetchAgents()
    resetForm()
  } catch (error) {
    toast.error(error.response?.data?.message || 'Erreur système')
  }
}

const openEditModal = (agent) => {
  toUpdate.value = agent
  newAgent.name = agent.name
  newAgent.email = agent.email
  newAgent.num = agent.num
  newAgent.dept = agent.dept?._id || agent.dept || ''
  isModalOpen.value = true
}

// Gestion de l'accès (Active/Inactive)
async function handleDigital(id, toggle) {
  if (!toggle) {
    const result = await Swal.fire({
      title: 'Restreindre l\'accès ?',
      text: "L'agent ne pourra plus se connecter.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui, restreindre',
      cancelButtonText: 'Annuler'
    })
    if (!result.isConfirmed) return
  }

  try {
    await userService.updateUser(id, { isActive: toggle })
    toast.info(toggle ? 'Accès activé' : 'Accès restreint')
    fetchAgents()
  } catch (err) {
    toast.error('Erreur de statut')
  }
}

watch(search, () => fetchAgents())
onMounted(fetchAgents)
</script>

<template>
  <main class="flex-1 p-6 lg:p-10 w-full min-h-screen space-y-8 bg-slate-50 text-slate-800">
    
    <header class="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
      <div>
        <h1 class="text-3xl font-black tracking-tight text-slate-900">Agents de Terrain</h1>
        <p class="text-slate-500 mt-1 text-sm font-medium">Gestion des accès et affectations des agents</p>
      </div>

      <button @click="isModalOpen = true" class="flex items-center gap-2 px-6 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl text-sm font-bold shadow-lg shadow-emerald-200 transition-all active:scale-95">
        <Plus class="w-5 h-5" /> Nouvel Agent
      </button>
    </header>

    <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="stat in stats" :key="stat.title" class="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
        <div class="flex justify-between items-start">
          <div class="space-y-1">
            <span class="text-xs font-bold text-slate-400 uppercase tracking-wider">{{ stat.title }}</span>
            <h3 class="text-2xl font-black text-slate-900">{{ stat.value }}</h3>
          </div>
          <div :class="['p-2.5 rounded-xl bg-slate-50', stat.color]">
            <component :is="stat.icon" class="w-5 h-5" />
          </div>
        </div>
      </div>
    </section>

    <section class="relative">
      <Search class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
      <input v-model="search" type="text" placeholder="Rechercher un agent..." class="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm outline-none focus:border-emerald-500 transition-all" />
    </section>

    <div class="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-slate-50/50 border-b border-slate-100">
              <th class="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest">Agent</th>
              <th class="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest">Contact</th>
              <th class="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest">Département</th>
              <th class="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest text-center">Campagnes</th>
              <th class="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest text-center">Statut</th>
              <th class="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-50">
            <tr v-for="agent in agents" :key="agent._id" class="hover:bg-slate-50/50 transition-colors group">
              <td class="px-6 py-4">
                <div class="flex items-center gap-4">
                  <div class="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-500">
                    <UserCircle class="w-6 h-6" />
                  </div>
                  <div class="font-bold text-slate-900 text-sm">{{ agent.name }}</div>
                </div>
              </td>
              <td class="px-6 py-4 text-sm">
                <div class="text-slate-600 flex flex-col">
                  <span class="flex items-center gap-1"><Mail class="w-3 h-3"/> {{ agent.email }}</span>
                  <span class="flex items-center gap-1 text-xs text-slate-400"><Phone class="w-3 h-3"/> {{ agent.num }}</span>
                </div>
              </td>
              <td class="px-6 py-4">
                <span class="px-3 py-1 bg-slate-100 rounded-lg text-[10px] font-bold text-slate-600 uppercase">
                  {{ agent.dept?.name || 'Général' }}
                </span>
              </td>
              <td class="px-6 py-4 text-center">
                <span class="text-sm font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                  {{ agent.campaigns?.length || 0 }}
                </span>
              </td>
              <td class="px-6 py-4 text-center">
                <button @click="handleDigital(agent._id, !agent.isActive)" :class="[
                  'px-3 py-1 rounded-full text-[10px] font-black uppercase border transition-all',
                  agent.isActive ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'
                ]">
                  {{ agent.isActive ? 'Actif' : 'Bloqué' }}
                </button>
              </td>
              <td class="px-6 py-4 text-right">
                <button @click="openEditModal(agent)" class="p-2 border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-500 opacity-0 group-hover:opacity-100 transition-all">
                  <Edit2 class="w-4 h-4" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <Transition name="fade">
      <div v-if="isModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" @click="resetForm"></div>
        <div class="relative w-full max-w-lg bg-white rounded-[32px] p-8 shadow-2xl">
          <h2 class="text-xl font-black mb-6">{{ toUpdate ? 'Modifier Agent' : 'Nouvel Agent' }}</h2>
          <form @submit.prevent="handleSubmit" class="space-y-4">
            <input v-model="newAgent.name" type="text" placeholder="Nom complet" required class="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-emerald-500" />
            <input v-model="newAgent.email" type="email" placeholder="Email" required class="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-emerald-500" />
            <input v-model="newAgent.num" type="tel" placeholder="Téléphone" class="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-emerald-500" />
            
            <select v-model="newAgent.dept" class="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl outline-none">
              <option value="">Département...</option>
              <option v-for="d in departments" :key="d.id || d._id" :value="d.id || d._id">{{ d.name }}</option>
            </select>

            <div class="flex gap-3 pt-4">
              <button type="button" @click="resetForm" class="flex-1 py-4 font-bold text-slate-400">Annuler</button>
              <button type="submit" class="flex-1 py-4 bg-emerald-600 text-white rounded-2xl font-bold shadow-lg shadow-emerald-200">
                {{ toUpdate ? 'Mettre à jour' : 'Créer l\'agent' }}
              </button>
            </div>
          </form>
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
