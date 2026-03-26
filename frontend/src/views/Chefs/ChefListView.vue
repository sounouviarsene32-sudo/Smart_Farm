<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import chefService from '@/services/chef.js'
import departementService from '@/services/departement.js'
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
} from 'lucide-vue-next'
import ChefCard from '@/components/ChefCard.vue'

// --- États ---
const isModalOpen = ref(false)
const chefs = ref([])
const departments = ref([])
const toUpdate = ref(null)
const search = ref('')
const stats = ref([])

// --- Formulaire Réactif ---
const newChef = reactive({
  name: '',
  email: '',
  num: '',
  dept: '',
  haveCount: false,
  role: 'chef', // Fixé pour le backend
})

// --- Chargement des données ---
async function fetchData() {
  try {
    const resChefs = await chefService.getAllChefs({ page: 1, limit: 12, search: search.value })

    chefs.value = resChefs.data.items || resChefs.items || []
    console.log(chefs.value)
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

// --- Logique du Formulaire ---
const resetForm = () => {
  Object.assign(newChef, { name: '', email: '', num: '', dept: '', haveCount: false })
  toUpdate.value = null
  isModalOpen.value = false
}

const handleSubmit = async () => {
  try {
    console.log('Chef submit payload:', JSON.stringify(newChef))

    if (toUpdate.value) {
      await chefService.updateChef(toUpdate.value._id, newChef)
    } else {
      await chefService.addChef(newChef)
    }
    await fetchData()
    resetForm()
  } catch (error) {
    console.error('Erreur lors de l\'enregistrement Chef :', error)
    alert(`Erreur lors de l'enregistrement : ${error?.response?.data?.message || error.message}`)
  }
}

const openEditModal = (chef) => {
  toUpdate.value = chef
  newChef.name = chef.name
  newChef.email = chef.email
  newChef.num = chef.num
  newChef.dept = chef.dept?._id || chef.dept
  newChef.haveCount = chef.haveCount
  isModalOpen.value = true
}

const handleDelete = async (id) => {
  // if (confirm('Supprimer ce responsable ?')) {
  await chefService.deleteChef(id)
  fetchData()
  // }
}

const availableDepartments = computed(() => {
  const assignedDeptIds = chefs.value
    .map((chef) => (chef.dept?._id || chef.dept || chef.dept?.id)?.toString())
    .filter(Boolean)

  const editingDeptId = (toUpdate.value?.dept?._id || toUpdate.value?.dept || toUpdate.value?.dept?.id)?.toString()

  const filtered = departments.value.filter((dept) => {
    const deptId = (dept._id || dept.id || dept).toString()
    if (editingDeptId && deptId === editingDeptId) return true
    return !assignedDeptIds.includes(deptId)
  })

  // Si aucune dept n'est libre, on propose toutes les départements afin de ne pas bloquer la création.
  return filtered.length > 0 ? filtered : departments.value
})

onMounted(fetchData)
</script>

<template>
  <main
    class="flex-1 lg:ml-64 p-6 lg:p-10 w-full min-h-screen space-y-10 
           bg-slate-50 text-slate-800"
  >
    <!-- HEADER -->
    <header class="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
      <div>
        <h1 class="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900">
          Chefs de Département
        </h1>
        <p class="text-slate-500 mt-2 text-sm md:text-base">
          Gérez les responsables avec efficacité
        </p>
      </div>

      <button
        @click="isModalOpen = true"
        class="flex items-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-500 
               text-white rounded-xl text-sm font-semibold shadow-md 
               hover:shadow-lg transition-all active:scale-95"
      >
        <Plus class="w-5 h-5" /> Nouveau Chef
      </button>
    </header>

    <!-- STATS -->
    <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <div
        v-for="stat in stats"
        :key="stat.title"
        class="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition"
      >
        <div class="flex justify-between items-center">
          <span class="text-sm text-slate-500">{{ stat.title }}</span>
          <div class="p-2 rounded-lg bg-blue-100 text-blue-600">
            <component :is="stat.icon" class="w-5 h-5" />
          </div>
        </div>
        <h3 class="text-3xl font-bold text-slate-900 mt-4">{{ stat.value }}</h3>
      </div>
    </section>

    <!-- SEARCH -->
    <section class="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
      <div class="relative w-full max-w-xl">
        <Search class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input
          v-model="search"
          @input="fetchData"
          type="search"
          placeholder="Rechercher un chef..."
          class="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 
                 rounded-xl text-sm text-slate-700 placeholder:text-slate-400
                 focus:ring-2 focus:ring-blue-500 outline-none transition"
        />
      </div>
    </section>

    <!-- LISTE -->
    <section v-if="chefs.length > 0" class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
      <ChefCard
        v-for="chef in chefs"
        :key="chef._id"
        :chef="chef"
        @edit="openEditModal(chef)"
        @delete="handleDelete(chef._id)"
      />
    </section>

    <!-- EMPTY -->
    <section
      v-else
      class="text-center py-20 bg-white border border-slate-200 rounded-2xl shadow-sm"
    >
      <UserCircle class="w-16 h-16 text-slate-300 mx-auto mb-4" />
      <p class="text-slate-500 font-medium">Aucun chef trouvé</p>
    </section>

    <!-- MODAL -->
    <Transition name="fade">
      <div v-if="isModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        
        <!-- backdrop -->
        <div
          class="absolute inset-0 bg-black/30 backdrop-blur-sm"
          @click="resetForm"
        ></div>

        <!-- modal -->
        <div
          class="relative w-full max-w-lg bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          <!-- header -->
          <div class="p-6 border-b flex justify-between items-center">
            <h2 class="text-lg font-bold text-slate-800">
              {{ toUpdate ? 'Modifier Chef' : 'Nouveau Chef' }}
            </h2>
            <button @click="resetForm" class="p-2 hover:bg-slate-100 rounded-lg">
              <X class="w-5 h-5 text-slate-400" />
            </button>
          </div>

          <!-- form -->
          <form @submit.prevent="handleSubmit" class="p-6 space-y-5">
            
            <input
              v-model="newChef.name"
              type="text"
              placeholder="Nom complet"
              required
              class="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200
                     focus:ring-2 focus:ring-blue-500 outline-none"
            />

            <input
              v-model="newChef.email"
              type="email"
              placeholder="Email"
              required
              class="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200
                     focus:ring-2 focus:ring-blue-500 outline-none"
            />

            <div class="grid grid-cols-2 gap-4">
              <input
                v-model="newChef.num"
                type="tel"
                placeholder="Téléphone"
                class="px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 outline-none"
              />

              <select
                v-model="newChef.dept"
                required
                class="px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 outline-none"
              >
                <option value="">Département</option>
                <option
                  v-for="dept in availableDepartments"
                  :key="dept._id"
                  :value="dept._id"
                >
                  {{ dept.name }}
                </option>
              </select>
            </div>

            <div class="flex items-center gap-3">
              <input v-model="newChef.haveCount" type="checkbox" />
              <span class="text-sm text-slate-600">
                Créer un accès système
              </span>
            </div>

            <div class="flex gap-3 pt-4">
              <button
                type="button"
                @click="resetForm"
                class="flex-1 py-3 text-sm font-semibold text-slate-500 
                       hover:bg-slate-100 rounded-xl"
              >
                Annuler
              </button>
              <button
                type="submit"
                class="flex-1 py-3 bg-blue-600 text-white rounded-xl 
                       font-semibold hover:bg-blue-500 transition"
              >
                {{ toUpdate ? 'Modifier' : 'Créer' }}
              </button>
            </div>

          </form>
        </div>
      </div>
    </Transition>
  </main>
</template>
