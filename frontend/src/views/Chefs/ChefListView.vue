<script setup>
import { ref, reactive, onMounted } from 'vue'
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
    if (toUpdate.value) {
      await chefService.updateChef(toUpdate.value._id, newChef)
    } else {
      await chefService.addChef(newChef)
    }
    await fetchData()
    resetForm()
  } catch (error) {
    alert("Erreur lors de l'enregistrement")
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

onMounted(fetchData)
</script>

<template>
  <main
    class="flex-1 lg:ml-64 p-4 lg:p-8 transition-all duration-300 w-full bg-red-50 min-h-screen space-y-8"
  >
    <header class="flex justify-between items-start mb-8">
      <div>
        <h1 class="text-3xl font-extrabold text-slate-950">Chefs de Département</h1>
        <p class="text-slate-500 mt-1">Gestion des responsables de l'exploitation</p>
      </div>
      <button
        @click="isModalOpen = true"
        class="flex items-center gap-2.5 px-6 py-3 bg-slate-950 text-white rounded-xl text-sm font-semibold shadow-sm hover:bg-slate-800 transition-all"
      >
        <Plus class="w-5 h-5" /> Ajouter un Chef
      </button>
    </header>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div
        v-for="stat in stats"
        :key="stat.title"
        class="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm"
      >
        <div class="flex justify-between items-start">
          <span class="text-sm font-medium text-slate-500">{{ stat.title }}</span>
          <div :class="['p-2.5 rounded-xl', stat.bg, stat.color]">
            <component :is="stat.icon" class="w-5 h-5" />
          </div>
        </div>
        <h3 class="text-3xl font-extrabold text-slate-900 mt-5">{{ stat.value }}</h3>
      </div>
    </div>

    <div class="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
      <div class="relative w-full max-w-xl">
        <Search class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input
          v-model="search"
          @input="fetchData"
          type="search"
          placeholder="Rechercher un chef par nom..."
          class="w-full pl-12 pr-4 py-3.5 bg-slate-50 text-slate-900 rounded-xl border border-slate-200 focus:ring-2 focus:ring-slate-300 outline-none transition-all"
        />
      </div>
    </div>

    <div v-if="chefs.length > 0" class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
      <ChefCard
        v-for="chef in chefs"
        :key="chef._id"
        :chef="chef"
        @edit="openEditModal(chef)"
        @delete="handleDelete(chef._id)"
      />
    </div>

    <div v-else class="text-center py-20 bg-white rounded-3xl border border-slate-100">
      <UserCircle class="w-16 h-16 text-slate-200 mx-auto mb-4" />
      <p class="text-slate-500 font-medium">Aucun responsable trouvé.</p>
    </div>

    <Transition name="fade">
      <div v-if="isModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" @click="resetForm"></div>
        <div
          class="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-100 overflow-hidden animate-in zoom-in duration-200"
        >
          <div class="p-8 border-b border-slate-50 flex justify-between items-center">
            <h2 class="text-xl font-black text-slate-900">
              {{ toUpdate ? 'Modifier le Chef' : 'Nouveau Chef' }}
            </h2>
            <button @click="resetForm" class="p-2 hover:bg-slate-50 rounded-full transition-colors">
              <X class="w-5 h-5 text-slate-400" />
            </button>
          </div>

          <form @submit.prevent="handleSubmit" class="p-8 space-y-5">
            <div class="space-y-2">
              <label class="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1"
                >Nom Complet</label
              >
              <input
                v-model="newChef.name"
                type="text"
                required
                class="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm outline-none focus:border-slate-950 transition-all"
              />
            </div>

            <div class="space-y-2">
              <label class="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1"
                >Email Professionnel</label
              >
              <input
                v-model="newChef.email"
                type="email"
                required
                class="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm outline-none focus:border-slate-950 transition-all"
              />
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-2">
                <label class="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1"
                  >Téléphone</label
                >
                <input
                  v-model="newChef.num"
                  type="tel"
                  class="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm outline-none focus:border-slate-950 transition-all"
                />
              </div>
              <div class="space-y-2">
                <label class="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1"
                  >Département</label
                >
                <select
                  v-model="newChef.dept"
                  required
                  class="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm outline-none appearance-none focus:border-slate-950 transition-all"
                >
                  <option value="">Sélectionner</option>
                  <option v-for="dept in departments" :key="dept.id" :value="dept.id">
                    {{ dept.name }}
                  </option>
                </select>
              </div>
            </div>

            <div class="flex items-center gap-3 pt-2">
              <input
                v-model="newChef.haveCount"
                type="checkbox"
                id="chefCount"
                class="w-4 h-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900"
              />
              <label
                for="chefCount"
                class="text-xs font-bold uppercase tracking-wider text-slate-600 cursor-pointer"
                >Créer un compte accès système</label
              >
            </div>

            <div class="flex gap-3 pt-6">
              <button
                type="button"
                @click="resetForm"
                class="flex-1 py-4 text-sm font-bold text-slate-500 hover:bg-slate-50 rounded-2xl transition-all"
              >
                Annuler
              </button>
              <button
                type="submit"
                class="flex-1 py-4 bg-slate-950 text-white text-sm font-bold rounded-2xl hover:bg-slate-800 shadow-lg active:scale-95 transition-all"
              >
                {{ toUpdate ? 'Enregistrer' : 'Confirmer' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Transition>
  </main>
</template>
