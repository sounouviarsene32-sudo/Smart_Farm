<script setup>
import { ref, computed, onMounted } from 'vue';
import { 
  FileText, 
  Download, 
  Calendar, 
  TrendingUp, 
  Package, 
  Heart,
  DollarSign,
  Search
} from 'lucide-vue-next';

const loading = ref(false);
const campaigns = ref([]);
const selectedCampaign = ref('');
const startDate = ref('');
const endDate = ref('');
const reportType = ref('financier');
const reports = ref([]);

const reportTypes = [
  { value: 'financier', label: 'Rapport Financier', icon: DollarSign, color: 'text-green-600' },
  { value: 'production', label: 'Rapport Production', icon: Package, color: 'text-blue-600' },
  { value: 'stock', label: 'Rapport Stock', icon: TrendingUp, color: 'text-orange-600' },
  { value: 'sante', label: 'Rapport Santé', icon: Heart, color: 'text-red-600' }
];

// Charger les campagnes
const loadCampaigns = async () => {
  try {
    const res = await fetch('http://localhost:8080/api/campaigns');
    campaigns.value = await res.json();
  } catch (error) {
    console.error('Erreur chargement campagnes:', error);
  }
};

// Générer un rapport
const generateReport = async () => {
  if (!selectedCampaign.value || !startDate.value || !endDate.value) {
    alert('Veuillez remplir tous les champs');
    return;
  }

  loading.value = true;
  try {
    const endpoint = `http://localhost:8080/api/reports/${reportType.value}`;
    const payload = {
      campaignId: selectedCampaign.value,
      startDate: startDate.value,
      endDate: endDate.value
    };

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      throw new Error('Erreur génération rapport');
    }

    const report = await res.json();
    reports.value.unshift({ ...report, id: Date.now(), type: reportType.value });
    
    // Réinitialiser le formulaire
    selectedCampaign.value = '';
    startDate.value = '';
    endDate.value = '';
    
  } catch (error) {
    console.error('Erreur génération rapport:', error);
    alert('Erreur lors de la génération du rapport');
  } finally {
    loading.value = false;
  }
};

// Télécharger un rapport
const downloadReport = (report) => {
  const dataStr = JSON.stringify(report, null, 2);
  const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
  
  const exportFileDefaultName = `rapport-${report.type}-${new Date().toISOString().split('T')[0]}.json`;
  
  const linkElement = document.createElement('a');
  linkElement.setAttribute('href', dataUri);
  linkElement.setAttribute('download', exportFileDefaultName);
  linkElement.click();
};

onMounted(() => {
  loadCampaigns();
});
</script>

<template>
  <div class="p-6 bg-gray-50 min-h-screen">
    <header class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">Générateur de Rapports</h1>
      <p class="text-gray-600">Créez des rapports détaillés pour vos campagnes</p>
    </header>

    <div class="bg-white rounded-lg shadow-md p-6">
      <!-- Formulaire de génération -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <!-- Type de rapport -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Type de Rapport</label>
          <select 
            v-model="reportType" 
            class="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            <option v-for="type in reportTypes" :key="type.value" :value="type.value">
              {{ type.label }}
            </option>
          </select>
        </div>

        <!-- Campagne -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Campagne</label>
          <select 
            v-model="selectedCampaign" 
            class="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Sélectionner une campagne...</option>
            <option v-for="campaign in campaigns" :key="campaign._id" :value="campaign._id">
              {{ campaign.name }}
            </option>
          </select>
        </div>

        <!-- Date début -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Date Début</label>
          <input 
            v-model="startDate" 
            type="date" 
            class="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <!-- Date fin -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Date Fin</label>
          <input 
            v-model="endDate" 
            type="date" 
            class="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      <!-- Bouton de génération -->
      <div class="flex justify-center mb-6">
        <button
          @click="generateReport"
          :disabled="loading"
          class="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <div v-if="loading" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          {{ loading ? 'Génération...' : 'Générer le Rapport' }}
        </button>
      </div>

      <!-- Liste des rapports générés -->
      <div v-if="reports.length > 0" class="border-t pt-6">
        <h2 class="text-xl font-semibold text-gray-900 mb-4">Rapports Récents</h2>
        <div class="space-y-3">
          <div 
            v-for="report in reports" 
            :key="report.id"
            class="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div class="flex items-center gap-3">
              <div class="p-2 bg-white rounded-lg">
                <component 
                  :is="reportTypes.find(t => t.value === report.type)?.icon || FileText" 
                  :class="reportTypes.find(t => t.value === report.type)?.color || 'text-gray-600'"
                  class="w-5 h-5"
                />
              </div>
              <div>
                <h3 class="font-medium text-gray-900">
                  {{ reportTypes.find(t => t.value === report.type)?.label }}
                </h3>
                <p class="text-sm text-gray-500">
                  {{ report.period || report.generatedAt }}
                </p>
              </div>
            </div>
            <button
              @click="downloadReport(report)"
              class="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <Download class="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>