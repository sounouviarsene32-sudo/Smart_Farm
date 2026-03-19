<script setup>
import { ref, computed } from 'vue';
import { Search, PlusCircle, Users, Activity, Target, BrainCircuit, PawPrint } from 'lucide-vue-next';
import ChefCard from '../../components/ChefCard.vue'; // Import du composant enfant

// --- 1. Données simulées (Stats globales) ---
const stats = ref([
  { title: 'Total Chefs', value: '45', icon: Users, color: 'blue' },
  { title: 'Chefs actifs', value: '31', icon: BrainCircuit, color: 'green' },
  { title: 'Total Départements', value: '1250', icon: PawPrint, color: 'orange' },
  { title: 'Performance Moy.', value: '88.8%', icon: Target, color: 'purple' }
]);

// --- 2. Données simulées (Liste complète des chefs) ---
const allChefs = ref([
  { id: 1, nom: 'Jean Dupont', departement: 'Volaille', email: 'jean.dupont@elevage.com', telephone: '+221 77 123 45 67', dateArrivee: '15/01/2022', totalAgents: 12, totalAnimaux: 450, performance: 'Excellent' },
  { id: 2, nom: 'Marie Martin', departement: 'Bovins', email: 'marie.martin@elevage.com', telephone: '+221 77 234 56 78', dateArrivee: '20/06/2021', totalAgents: 8, totalAnimaux: 320, performance: 'Très Bon' },
  { id: 3, nom: 'Pierre Durand', departement: 'Caprins', email: 'pierre.durand@elevage.com', telephone: '+221 77 345 67 89', dateArrivee: '10/03/2022', totalAgents: 6, totalAnimaux: 280, performance: 'Très Bon' },
  { id: 4, nom: 'Sophie Bernard', departement: 'Ovins', email: 'sophie.bernard@elevage.com', telephone: '+221 77 456 78 90', dateArrivee: '05/11/2021', totalAgents: 5, totalAnimaux: 200, performance: 'Excellent' }
]);

// --- 3. Logique de Recherche ---
const searchQuery = ref('');

// Propriété calculée pour filtrer la liste en fonction de la recherche
const filteredChefs = computed(() => {
  const query = searchQuery.value.toLowerCase().trim();
  if (!query) return allChefs.value;
  
  return allChefs.value.filter(chef => 
    chef.nom.toLowerCase().includes(query) || 
    chef.departement.toLowerCase().includes(query)
  );
});

// --- 4. Logique des Actions ---
const handleAddChef = () => alert('Ajouter un nouveau chef...');
const handleEditChef = (id) => alert(`Modifier le chef avec l'ID : ${id}`);
const handleDeleteChef = (id) => {
  if (confirm('Êtes-vous sûr de vouloir supprimer ce responsable ?')) {
    allChefs.value = allChefs.value.filter(chef => chef.id !== id);
  }
};

// Fonctions utilitaires pour les couleurs des icônes
const getIconColor = (color) => {
  if (color === 'green') return 'text-emerald-500 bg-emerald-50';
  if (color === 'orange') return 'text-amber-500 bg-amber-50';
  if (color === 'purple') return 'text-purple-600 bg-purple-50';
  return 'text-blue-600 bg-blue-50'; // Par défaut (bleu)
};
</script>

<template>
  <main class="flex-1 lg:ml-64 p-4 lg:p-8 transition-all duration-300 w-full">
    
    <header class="flex justify-between items-start mb-10">
      <div>
        <h1 class="text-3xl font-extrabold text-slate-950">Chefs de Département</h1>
        <p class="text-slate-500 mt-1">Gestion des responsables de département de l'exploitation</p>
      </div>
      <button 
        @click="handleAddChef"
        class="flex items-center gap-2.5 px-6 py-3 bg-slate-950 text-white rounded-xl text-sm font-semibold shadow-sm transition-hover hover:bg-slate-800"
      >
        <PlusCircle class="w-5 h-5" /> Ajouter un Chef
      </button>
    </header>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
      <div v-for="stat in stats" :key="stat.title" class="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between">
        <div class="flex justify-between items-start">
          <span class="text-sm font-medium text-slate-500">{{ stat.title }}</span>
          <div :class="['p-2.5 rounded-xl', getIconColor(stat.color)]">
             <component :is="stat.icon" class="w-5 h-5" />
          </div>
        </div>
        <h3 class="text-3xl font-extrabold text-slate-900 mt-5">{{ stat.value }}</h3>
      </div>
    </div>

    <div class="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm mb-10">
      <div class="relative w-full max-w-xl">
        <Search class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input 
          v-model="searchQuery"
          type="search"
          placeholder="Rechercher un chef par nom ou département..."
          class="w-full pl-12 pr-4 py-3.5 bg-slate-50 text-slate-900 rounded-xl border border-slate-200 focus:ring-2 focus:ring-slate-300 focus:border-slate-300 transition-all outline-none"
        />
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
      <ChefCard 
        v-for="chef in filteredChefs" 
        :key="chef.id" 
        :chef="chef"
        @edit="handleEditChef"
        @delete="handleDeleteChef"
      />
    </div>

    <div v-if="filteredChefs.length === 0" class="text-center py-20 bg-slate-100 rounded-3xl border border-slate-200">
      <UserCircle class="w-16 h-16 text-slate-300 mx-auto mb-4" />
      <p class="text-slate-600 font-semibold">Aucun chef ne correspond à votre recherche.</p>
    </div>

</main>
</template>