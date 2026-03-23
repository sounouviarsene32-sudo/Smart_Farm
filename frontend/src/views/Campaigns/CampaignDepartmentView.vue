<script setup>
import { ref } from 'vue';
import { Target, CheckCircle2, TrendingUp, DollarSign, Plus } from 'lucide-vue-next';
import CampaignCard from '../../components/CampaignCard.vue'; // Import du composant enfant
import { useLoginStore } from '@/stores/login.store'
const loginStore = useLoginStore()
const currentUser = loginStore.getDecodedToken

// --- 1. Données simulées (Stats globales) ---
const stats = [
  { title: 'Campagnes Actives', value: '8', icon: Target, color: 'text-blue-600', bg: 'bg-blue-50' },
  { title: 'Total Campagnes', value: '15', icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-50' },
  { title: 'Progression Moy.', value: '58%', icon: TrendingUp, color: 'text-purple-600', bg: 'bg-purple-50' },
  { title: 'Budget Total', value: '8 950 000 FCFA', icon: DollarSign, color: 'text-orange-500', bg: 'bg-orange-50' }
];

// --- 2. Données simulées (Liste des campagnes) ---
const campaigns = ref([
  { id: 1, titre: 'Vaccination Volaille Q1', departement: 'Volaille', budgetTotal: 1000000, budgetDepense: 850000, progression: 75, utilisationBudget: 85 },
  { id: 2, titre: 'Nutrition Bovins', departement: 'Bovins', budgetTotal: 1500000, budgetDepense: 1200000, progression: 60, utilisationBudget: 80 },
  { id: 3, titre: 'Expansion Caprins', departement: 'Caprins', budgetTotal: 2500000, budgetDepense: 1100000, progression: 45, utilisationBudget: 44 }
]);
</script>

<template>
  <main class="flex-1 lg:ml-64 p-4 lg:p-8 transition-all duration-300 w-full bg-[#F8F9FA] min-h-screen space-y-8">
    
    <header class="flex justify-between items-start mb-8">
      <div>
        <h1 class="text-3xl font-extrabold text-slate-950">Campagnes</h1>
        <p class="text-slate-500 mt-1"> {{ currentUser.role == "chef" ? 'Gestion des campagnes et projets' : 'Suivi des campagnes' }}</p>
      </div>
      <button v-if="currentUser.role == 'chef'" class="flex items-center gap-2.5 px-6 py-3.5 bg-slate-950 text-white rounded-xl text-sm font-semibold shadow-sm transition-hover hover:bg-slate-800">
        <Plus class="w-5 h-5" /> Nouvelle Campagne
      </button>
    </header>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
      <div v-for="stat in stats" :key="stat.title" class="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between">
        <div class="flex justify-between items-start">
          <span class="text-sm font-medium text-slate-500">{{ stat.title }}</span>
          <div :class="['p-2.5 rounded-xl', stat.bg, stat.color]">
             <component :is="stat.icon" class="w-5 h-5" />
          </div>
        </div>
        <h3 class="text-3xl font-extrabold text-slate-900 mt-5">{{ stat.value }}</h3>
      </div>
    </div>

    <div class="space-y-6">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-xl font-bold text-slate-900">{{ currentUser.role == "chef" ? 'Campagnes en Cours' : 'Vos Campagnes' }}</h2>
      </div>

      <div class="space-y-6">
        <CampaignCard 
          v-for="campaign in campaigns" 
          :key="campaign.id" 
          :campaign="campaign"
        />
      </div>
    </div>

</main>
</template>