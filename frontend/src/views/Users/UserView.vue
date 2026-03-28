<script setup>
import userService from '@/services/users.js'
import { ref, reactive, onMounted, watch } from 'vue'
import departementService from '@/services/departement.js'
import { useToast } from 'vue-toastification'

import {
  Users,
  ShieldCheck,
  UserCircle,
  UserCog,
  Search,
  Plus,
  Edit2,
  Lock,
  Trash2,
  Mail,
  X,
} from 'lucide-vue-next'

const users = ref()
const toast = useToast()
const allRoles = ref()
const role = ref('')
const search = ref('')
const departments = ref([])

// Statistiques du haut
const stats = ref()
async function allUsers() {
  try {
    // Si role === 'Tous les rôles', on envoie une chaîne vide
    const selectedRole = role.value === 'Tous les rôles' ? '' : role.value

    const res = await userService.getAllUsers({
      page: 1,
      limit: 10,
      search: search.value,
      role: selectedRole,
    })
    const departmentsData = await departementService.getDepartements()
    departments.value = departmentsData.data || departmentsData
    users.value = res.data.items
    allRoles.value = res.data.allRoles
    const admin = users.value.filter((u) => u.role === 'admin').length
    const chef = users.value.filter((u) => u.role === 'chef').length
    const agent = users.value.filter((u) => u.role === 'agent').length
    stats.value = [
      {
        title: 'Total Utilisateurs',
        value: res.data.total,
        icon: Users,
        color: 'text-blue-600',
      },
      { title: 'Administrateurs', value: admin, icon: ShieldCheck, color: 'text-purple-600' },
      { title: 'Chefs Département', value: chef, icon: UserCircle, color: 'text-blue-500' },
      { title: 'Agents', value: agent, icon: UserCog, color: 'text-emerald-500' },
    ]
  } catch (error) {
    console.error(error)
  }
}
const isModalOpen = ref(false)
const toUpdate = ref(null)
const newUser = reactive({
  name: '',
  email: '',
  role: 'agent',
  dept: '',
  num: '',
  password: '',
})

const roles = ['admin', 'chef', 'agent']
const départements = ['-', 'Volaille', 'Bovins', 'Caprins', 'Ovins']

const resetForm = () => {
  newUser.name = ''
  newUser.email = ''
  newUser.role = 'agent'
  newUser.dept = ''
  newUser.num = ''
  newUser.password = ''
  isModalOpen.value = false
}

// Logique d'ajout
// users.vue

function handleCreateUser() {
  // Créer une copie pour ne pas polluer l'objet réactif
  const dataToSend = { ...newUser }

  // Si le mot de passe est vide, on laisse le backend gérer le défaut
  if (!dataToSend.password) {
    delete dataToSend.password
  }

  userService
    .register(dataToSend)
    .then(() => {
      allUsers()
      resetForm() // Ferme la modale et reset
    })
    .catch((error) => {
      // Affiche l'erreur réelle renvoyée par ton API
      toast.error(error.response?.data?.message || 'Erreur de création')
      console.error(error)
    })
}

// modifier
function editing(user) {
  newUser.name = user.name
  newUser.email = user.email
  newUser.role = user.role
  newUser.dept = user.dept
  newUser.num = user.num
  isModalOpen.value = true
  toUpdate.value = user
}
const handleEdit = async (user) => {
  // Logique de modification
  userService
    .updateUserProfile(user._id, newUser)
    .then((response) => {
      allUsers()
      isModalOpen.value = false
    })
    .catch((error) => {
      console.error("Erreur lors de la modification de l'utilisateur:", error)
    })
}

const handleSubmit = async () => {
  if (toUpdate.value) {
    await handleEdit(toUpdate.value)
    toUpdate.value = null
  } else {
    handleCreateUser()
  }
}

// delete user
const handleDelete = async (userId) => {
  try {
    await userService.deleteUser(userId)
    allUsers()
  } catch (error) {
    console.error("Erreur lors de la suppression de l'utilisateur:", error)
  }
}

// Helpers pour les styles de badges
const getRoleClass = (role) => {
  if (role === 'admin') return 'bg-purple-600 text-white'
  if (role === 'chef') return 'bg-blue-600 text-white'
  return 'bg-emerald-500 text-white'
}

const getRoleIcon = (role) => {
  if (role === 'Admin') return ShieldCheck
  if (role === 'Chef') return UserCircle
  return UserCog
}

async function handleAgentDigital(id, toggle) {
  try {
    // if (!selectedAgentForCamp.value) return

    // On envoie le tableau complet des IDs sélectionnés
    await userService.updateUser(id, {
      isActive: toggle,
    })
    if(toggle==true){
      toast.success("Accès digital octoyé")
    } else {
      toast.success("Accès digital restreint")

    }
    await allUsers()
  } catch (error) {
    toast.error("Erreur lors de l'assignation")
  }
}

watch([search, role], () => {
  allUsers()
})

onMounted(allUsers)
</script>

<template>
  <main
    class="flex-1 lg:ml-64 p-4 lg:p-8 transition-all duration-300 w-full bg-slate-50 min-h-screen space-y-8"
  >
    <div class="flex justify-between items-start mb-8">
      <div>
        <h1 class="text-2xl font-bold text-slate-900">Utilisateurs</h1>
        <p class="text-slate-500 text-sm">Gestion des comptes et addmissions</p>
      </div>
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

            <div class="space-y-2">
              <label class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1"
                >Mot de passe</label
              >
              <div class="relative">
                <Mail class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                <input
                  v-model="newUser.password"
                  type="password"
                  placeholder="password1234"
                  class="w-full pl-12 pr-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm outline-none focus:ring-4 focus:ring-slate-950/5 focus:bg-white focus:border-slate-950 transition-all"
                />
              </div>
              <samp
                ><small class="text-xs text-slate-400"
                  >Le mot de passe doit contenir au moins 8 caractères et inclure un chiffre.</small
                >
                <span class="text-xs text-red-500">(Facultatif)</span>
              </samp>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-2">
                <label class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1"
                  >Rôle</label
                >
                <select
                  v-model="newUser.role"
                  class="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm outline-none appearance-none focus:bg-white focus:border-slate-950 transition-all cursor-pointer"
                >
                  <option v-for="r in roles" :key="r" :value="r">{{ r }}</option>
                </select>
              </div>

              <div class="space-y-2">
                <label class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1"
                  >Département</label
                >
                <select
                  v-model="newUser.dept"
                  class="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm outline-none appearance-none focus:bg-white focus:border-slate-950 transition-all cursor-pointer"
                >
                  <option v-for="d in departments" :key="d" :value="d.id">{{ d.name }}</option>
                </select>
              </div>
            </div>

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
                class="flex-1 py-4 bg-blue-600 text-white text-sm font-bold rounded-2xl hover:bg-blue-500 transition-all shadow-lg active:scale-95"
              >
                Confirmer l'ajout
              </button>
            </div>
          </form>
        </div>
      </div>
    </Transition>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div
        v-for="stat in stats"
        :key="stat.title"
        class="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm"
      >
        <div class="flex justify-between items-start">
          <div class="space-y-4">
            <span class="text-sm font-medium text-slate-400">{{ stat.title }}</span>
            <div class="text-2xl font-bold text-slate-900">{{ stat.value }}</div>
          </div>
          <component :is="stat.icon" :class="[stat.color, 'w-6 h-6']" stroke-width="1.5" />
        </div>
      </div>
    </div>

    <div class="flex gap-4 mb-6">
      <div class="relative flex-1">
        <Search class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          v-model="search"
          placeholder="Rechercher par nom ou username..."
          class="w-full pl-11 pr-4 py-2.5 bg-slate-100/50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-slate-200 transition-all"
        />
      </div>
      <select
        v-model="role"
        class="bg-slate-100/50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-600 outline-none min-w-[200px]"
      >
        <option value="">Tous les rôles</option>
        <option v-for="r in allRoles" :key="r" :value="r">
          {{ r.charAt(0).toUpperCase() + r.slice(1) }}
        </option>
      </select>
    </div>

    <div class="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <div class="p-6 border-b border-slate-50">
        <h2 class="font-bold text-slate-800">Liste des Utilisateurs</h2>
      </div>

      <table class="w-full text-left">
        <thead>
          <tr
            class="text-slate-400 text-xs font-semibold uppercase tracking-wider border-b border-slate-50"
          >
            <th class="px-6 py-4">Utilisateur</th>
            <th class="px-6 py-4">Email</th>
            <th class="px-6 py-4 text-center">Rôle</th>
            <th class="px-6 py-4">Département</th>
            <th class="px-6 py-4 text-center">Statut</th>
            <th class="px-6 py-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-50">
          <tr v-for="user in users" :key="user.id" class="hover:bg-slate-50/50 transition-colors">
            <td class="px-6 py-4">
              <div class="font-bold text-slate-900 text-sm">{{ user.name }}</div>
              <div class="text-xs text-slate-400">{{ user.username }}</div>
            </td>
            <td class="px-6 py-4 text-sm text-slate-500">{{ user.email }}</td>
            <td class="px-6 py-4">
              <div class="flex justify-center">
                <span
                  :class="[
                    getRoleClass(user.role),
                    'px-3 py-1 rounded-full text-[10px] font-bold uppercase flex items-center gap-1.5',
                  ]"
                >
                  <component :is="getRoleIcon(user.role)" class="w-3 h-3" />
                  {{ user.role }}
                </span>
              </div>
            </td>
            <td class="px-6 py-4">
              <span
                v-if="user.dept"
                class="px-3 py-1 bg-white border border-slate-200 text-slate-600 rounded-lg text-[11px] font-bold"
              >
                {{ user.dept.name }}
              </span>
              <span v-else class="text-slate-300">-</span>
            </td>
            <td class="px-6 py-4">
              <div class="flex justify-center">
                <span
                  class="text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase"
                  :class="user.isActive ? 'bg-emerald-500' : 'bg-red-500'"
                >
                  {{ user.isActive ? 'Actif' : 'Inactif' }}
                </span>
              </div>
            </td>
            <td class="px-6 py-4">
              <div class="flex justify-end gap-2">
                <button
                  @click="editing(user)"
                  class="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-500 transition-colors"
                >
                  <Edit2 class="w-4 h-4" />
                </button>
                <button
                  @click="handleAgentDigital(user._id, user.isActive = !user.isActive)"
                  class="p-2 border border-slate-200 rounded-lg transition-colors"
                  :class="
                    user.isActive
                      ? 'hover:bg-amber-50 text-slate-400'
                      : 'hover:bg-emerald-50 text-emerald-600'
                  "
                >
                  <component :is="user.isActive ? 'Lock' : 'Unlock'" class="w-4 h-4" />
                  <!-- <span v-if="user.isActive " class="w-4 h-4" >Lock</span> -->
                </button>
                <!-- <button
                  @click="handleDelete(user._id)"
                  class="p-2 border border-rose-100 rounded-lg hover:bg-rose-50 text-rose-500 transition-colors"
                >
                  <Trash2 class="w-4 h-4" />
                </button> -->
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <button
      @click="isModalOpen = true"
      class="fixed bottom-8 right-8 z-40 bg-blue-600 text-white px-5 py-3 rounded-2xl flex items-center gap-3 text-sm font-black transition-all hover:bg-blue-500 hover:shadow-2xl hover:-translate-y-1 active:scale-95 shadow-xl shadow-blue-200/50 group"
    >
      <div
        class="bg-white/20 p-1 rounded-lg group-hover:rotate-90 transition-transform duration-300"
      >
        <Plus class="w-5 h-5" />
      </div>
      <span>CRÉER UTILISATEUR</span>
    </button>
  </main>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
