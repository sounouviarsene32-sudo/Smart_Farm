<script setup>
import { ref, onMounted } from 'vue';
import { LayoutGrid, Users2, UserSquare, Beef, Plus } from 'lucide-vue-next';
import DepartmentsCard from '@/components/DepartmentsCard.vue';
import departementService from '@/services/departement.js';
import DepartementForm from '../Form/DepartementForm.vue'; // import du formulaire modal

// Stats globaux dynamiques
const globalStats = ref({
  departements: 0,
  chefs: 0,
  agents: 0,
  animaux: 0
});

// Départements récupérés depuis l'API
const departments = ref([]);

// Contrôle l'affichage du modal de création
const showForm = ref(false);

// 🔥 Fonction pour charger les départements et calculer les stats
async function loadDepartments() {
  try {
    const data = await departementService.getDepartements();
    departments.value = data;

    // Calculer les stats globales
    globalStats.value.departements = data.length;
    globalStats.value.chefs = data.length; // 1 chef par département
    globalStats.value.agents = data.reduce((sum, d) => sum + (d.stats.agents || 0), 0);
    globalStats.value.animaux = data.reduce((sum, d) => sum + (d.stats.animals || 0), 0);

  } catch (err) {
    console.error("Erreur lors du chargement des départements :", err);
  }
}

// Charger au montage
onMounted(() => {
  loadDepartments();
});

// Ouverture du modal de création
function openForm() {
  showForm.value = true;
}

// Fermeture du modal
function closeForm() {
  showForm.value = false;
}

// Callback après création d'un département
function onDepartmentCreated(dept) {
  departments.value.push(dept); // ajouter à la liste
  loadDepartments(); // recalculer stats
  closeForm();
}

// Suppression d'un département depuis la card
function handleDeleted(deptId) {
  departments.value = departments.value.filter(d => (d._id || d.id) !== deptId);
  loadDepartments();
}
</script>

<template>
  <main class="flex-1 lg:ml-64 p-4 lg:p-8 transition-all duration-300 w-full bg-red-50 min-h-screen space-y-8">
    
    <!-- Header -->
    <header class="flex justify-between items-start mb-10">
      <div>
        <h1 class="text-3xl font-extrabold text-slate-900">Départements</h1>
        <p class="text-slate-500 mt-1">Vue organisationnelle de l'élevage</p>
      </div>
      <button @click="openForm"
              class="bg-gray-800 text-white px-5 py-3 rounded-xl flex items-center gap-2.5 text-sm font-bold shadow-sm transition-hover hover:scale-105 active:scale-95">
        <Plus class="w-5 h-5" /> Nouveau Département
      </button>
    </header>

    <!-- Stats globales -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
      <div class="bg-white p-6 rounded-lg border border-slate-100 shadow-sm flex items-center justify-between" v-for="stat in [
        { label: 'Départements', value: globalStats.departements, icon: LayoutGrid, color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: 'Total Chefs', value: globalStats.chefs, icon: UserSquare, color: 'text-purple-500', bg: 'bg-purple-50' },
        { label: 'Total Agents', value: globalStats.agents, icon: Users2, color: 'text-emerald-500', bg: 'bg-emerald-50' },
        { label: 'Total Animaux', value: globalStats.animaux, icon: Beef, color: 'text-orange-500', bg: 'bg-orange-50' }
      ]" :key="stat.label">
        <div class="space-y-1">
          <p class="text-xs font-semibold text-slate-400 uppercase tracking-wider">{{ stat.label }}</p>
          <p class="text-3xl font-extrabold text-slate-900">{{ stat.value }}</p>
        </div>
        <div :class="[stat.bg, stat.color, 'p-4 rounded-2xl']">
          <component :is="stat.icon" class="w-6 h-6" />
        </div>
      </div>
    </div>

    <!-- Liste des départements -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <DepartmentsCard
        v-for="dept in departments"
        :key="dept._id || dept.id"
        :dept="dept"
        :onDeleted="handleDeleted"
      />
    </div>

    <!-- Modal création département -->
    <DepartementForm
      :show="showForm"
      @close="closeForm"
      @created="onDepartmentCreated"
    />
  </main>
</template>