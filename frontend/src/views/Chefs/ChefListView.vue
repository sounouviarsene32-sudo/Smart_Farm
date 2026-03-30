<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import chefService from '@/services/chef.js'
import userService from '@/services/users'
import departementService from '@/services/departement.js'
import Swal from 'sweetalert2'
import { useToast } from 'vue-toastification'
import {
  Users,
  CheckCircle2,
  TrendingUp,
  Target,
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
const chefs = ref([])
const dept = ref('')
const departments = ref([])
const toUpdate = ref(null)
const search = ref('')
const stats = ref([])
const toast = useToast()

// --- Formulaire Réactif ---
const newChef = reactive({
  name: '',
  email: '',
  num: '',
  dept:'',
  role: 'chef', // Fixé pour le backend
})

// --- Chargement des données ---
async function fetchData() {
  try {
    const resChefs = await userService.getUsers({ page: 1, limit: 12, search: search.value, role: 'chef', dept: dept.value })
    chefs.value = resChefs.data.items || resChefs.items || []
    const departmentsData = await departementService.getDepartements()
    departments.value = departmentsData.data || departmentsData

    // departments.value = resDepts.data || resDepts

    // Mise à jour des stats dynamiques
    stats.value = [
      {
        title: 'Total Chefs',
        value: resChefs.data.total,
        icon: Users,
        color: 'text-blue-600',
        bg: 'bg-blue-50',
      },
      {
        title: 'Chefs Actifs',
        value: chefs.value.filter((c) => c.isActive).length,
        icon: CheckCircle2,
        color: 'text-emerald-500',
        bg: 'bg-emerald-50',
      },
      {
        title: 'Départements',
        value: departments.value.length,
        icon: Target,
        color: 'text-orange-500',
        bg: 'bg-orange-50',
      },
      {
        title: 'Performance Moy.',
        value: '88.8%',
        icon: TrendingUp,
        color: 'text-purple-500',
        bg: 'bg-purple-50',
      },
    ]
  } catch (error) {
    console.error('Erreur lors du chargement:', error)
  }
}


const availableDepartments = computed(() => {
  const assignedDeptIds = chefs.value
    .map((chef) => (chef.dept?._id || chef.dept?.id || chef.dept)?.toString())
    .filter(Boolean)

  const editingDeptId = (
    toUpdate.value?.dept?._id ||
    toUpdate.value?.dept?.id ||
    toUpdate.value?.dept
  )?.toString()

  const filtered = departments.value.filter((dept) => {
    const deptId = (dept._id || dept.id || dept).toString()
    if (editingDeptId && deptId === editingDeptId) return true
    return !assignedDeptIds.includes(deptId)
  })

  // Si aucune dept n'est libre, on propose toutes les départements afin de ne pas bloquer la création.
  return filtered.length > 0 ? filtered : departments.value
})

// --- Logique du Formulaire ---
const resetForm = () => {
  Object.assign(newChef, { name: '', email: '', num: '', dept: '', haveCount: false })
  toUpdate.value = null
  isModalOpen.value = false
}

const handleSubmit = async () => {
  console.log('-Chef tout cru',newChef)
  try {
    const payload = {
      ...newChef,
      dept: newChef.dept || undefined,
    };

    if (toUpdate.value) {
      await userService.updateUser(toUpdate.value._id, payload)
      toast.success('Chef mis à jour avec succès')
    } else {
      // console.log('-----Avant ajout',payload)
      await userService.register(payload)
      toast.success('Chef ajouté avec succès')
    }
    await fetchData()
    resetForm()
  } catch (error) {
    console.log(error.response?.data?.message || error.message)
    toast.error("Erreur lors de l'enregistrement: " + (error.response?.data?.message || error.message))
  }
}

const openEditModal = (chef) => {
  toUpdate.value = chef
  newChef.name = chef.name
  newChef.email = chef.email
  newChef.num = chef.num
  newChef.dept = chef.dept?._id || chef.dept?.id || chef.dept || ''
  newChef.haveCount = chef.haveCount
  isModalOpen.value = true
}

onMounted(fetchData)
</script>

<template>
  <main class="w-full min-h-screen space-y-8 bg-slate-50 text-slate-800">
    
    <header class="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
      <div>
        <h1 class="text-3xl font-black tracking-tight text-slate-900">
          Chefs de Département
        </h1>
        <p class="text-slate-500 mt-1 text-sm font-medium">
          {{ chefs.length }} responsable(s) assigné(s) au pilotage
        </p>
      </div>

      <button
        @click="isModalOpen = true"
        class="flex items-center gap-2 px-6 py-3.5 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl text-sm font-bold shadow-lg shadow-blue-200 transition-all active:scale-95"
      >
        <Plus class="w-5 h-5" /> Nouveau Chef
      </button>
    </header>

    <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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

    <section class="flex flex-col md:flex-row gap-4">
      <div class="relative flex-1">
        <Search class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          v-model="search"
          @input="fetchData"
          type="text"
          placeholder="Rechercher par nom, email ou département..."
          class="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all"
        />
      </div>
    </section>

    <div class="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-slate-50/50 border-b border-slate-100">
              <th class="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest">Responsable</th>
              <th class="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest">Contact</th>
              <th class="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest">Département</th>
              <th class="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest text-center">Effectif</th>
              <th class="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest text-center">Statut</th>
              <th class="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-50">
            <tr v-for="chef in chefs" :key="chef._id" class="hover:bg-slate-50/50 transition-colors group">
              <td class="px-6 py-4">
                <div class="flex items-center gap-4">
                  <div class="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                    <UserCircle class="w-6 h-6" />
                  </div>
                  <div>
                    <div class="font-bold text-slate-900 text-sm">{{ chef.name }}</div>
                    <div class="text-[10px] text-slate-400 font-medium italic">Inscrit le {{ chef.createdAt }}</div>
                  </div>
                </div>
              </td>

              <td class="px-6 py-4 text-sm">
                <div class="flex flex-col gap-1">
                  <div class="flex items-center gap-2 text-slate-600">
                    <Mail class="w-3.5 h-3.5 text-slate-400" /> {{ chef.email }}
                  </div>
                  <div class="flex items-center gap-2 text-slate-600">
                    <Phone class="w-3.5 h-3.5 text-slate-400" /> {{ chef.num }}
                  </div>
                </div>
              </td>

              <td class="px-6 py-4">
                <span class="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-xs font-bold border border-blue-100">
                  {{ chef.dept?.name || 'Non assigné' }}
                </span>
              </td>

              <td class="px-6 py-4">
                <div class="flex flex-col items-center gap-1">
                  <span class="text-sm font-bold text-slate-800">{{ chef.dept?.agentsCount || 0 }} Agents</span>
                  <span class="text-[10px] text-slate-400 font-medium">{{ chef.dept?.animalsCount || 0 }} Têtes</span>
                </div>
              </td>

              <td class="px-6 py-4 text-center">
                <button 
                  @click="handleDigital(chef._id, !chef.isActive)"
                  :class="[
                    'px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter border transition-all',
                    chef.isActive 
                      ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                      : 'bg-rose-50 text-rose-600 border-rose-100 opacity-60'
                  ]"
                >
                  {{ chef.isActive ? 'Actif' : 'Inactif' }}
                </button>
              </td>

              <td class="px-6 py-4 text-right">
                <div class="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    @click="openEditModal(chef)"
                    class="p-2 border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-500 transition-colors"
                  >
                    <Edit2 class="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="chefs.length === 0" class="text-center py-20 bg-white">
        <UserCircle class="w-16 h-16 text-slate-200 mx-auto mb-4" />
        <p class="text-slate-400 font-bold uppercase tracking-widest text-xs">Aucun chef trouvé</p>
      </div>
    </div>

    <Transition name="fade">
      <div v-if="isModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" @click="resetForm"></div>
        <div class="relative w-full max-w-lg bg-white rounded-[32px] shadow-2xl border border-slate-100 overflow-hidden">
          <div class="p-8 border-b border-slate-50 flex justify-between items-center">
            <div>
              <h2 class="text-xl font-black text-slate-900">{{ toUpdate ? 'Modifier Responsable' : 'Nouveau Responsable' }}</h2>
              <p class="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Configuration Chef de Département</p>
            </div>
            <button @click="resetForm" class="p-2 hover:bg-slate-50 rounded-full transition-colors">
              <X class="w-5 h-5 text-slate-400" />
            </button>
          </div>

          <form @submit.prevent="handleSubmit" class="p-8 space-y-5">
            <div class="space-y-1.5">
              <label class="text-[10px] font-black uppercase text-slate-400 ml-1">Identité</label>
              <input v-model="newChef.name" type="text" placeholder="Nom complet" required class="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:bg-white focus:border-blue-600 outline-none transition-all" />
            </div>

            <div class="space-y-1.5">
              <label class="text-[10px] font-black uppercase text-slate-400 ml-1">Email Professionnel</label>
              <input v-model="newChef.email" type="email" placeholder="email@domaine.com" required class="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:bg-white focus:border-blue-600 outline-none transition-all" />
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-1.5">
                <label class="text-[10px] font-black uppercase text-slate-400 ml-1">Mobile</label>
                <input v-model="newChef.num" type="tel" placeholder="+229..." class="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:bg-white focus:border-blue-600 outline-none transition-all" />
              </div>
              <div class="space-y-1.5">
                <label class="text-[10px] font-black uppercase text-slate-400 ml-1">Secteur</label>
                <select v-model="newChef.dept" required class="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:bg-white focus:border-blue-600 outline-none transition-all appearance-none cursor-pointer">
                  <option value="">Sélectionner...</option>
                  <option v-for="dept in availableDepartments" :key="dept.id" :value="dept.id">{{ dept.name }}</option>
                </select>
              </div>
            </div>

            <div class="flex gap-3 pt-6">
              <button type="button" @click="resetForm" class="flex-1 py-4 text-sm font-bold text-slate-500 hover:bg-slate-50 rounded-2xl transition-all">Annuler</button>
              <button type="submit" class="flex-1 py-4 bg-blue-600 text-white rounded-2xl text-sm font-bold hover:bg-blue-500 shadow-lg shadow-blue-200 transition-all active:scale-95">
                {{ toUpdate ? 'Enregistrer' : 'Confirmer la création' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Transition>
  </main>
</template>
