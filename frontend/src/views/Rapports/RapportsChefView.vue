<script setup>
import { ref, onMounted } from 'vue';
import { 
  FileText, 
  Users, 
  TrendingUp, 
  BarChart3,
  Calendar,
  Download,
  CheckCircle,
  Clock,
  AlertTriangle
} from 'lucide-vue-next';

const loading = ref(false);
const reports = ref([]);
const stats = ref({
  total: 0,
  validated: 0,
  pending: 0,
  rejected: 0
});

// Charger les rapports soumis par les agents
const loadReports = async () => {
  loading.value = true;
  try {
    const res = await fetch('http://localhost:8080/api/reports/pending?role=chef');
    if (res.ok) {
      const data = await res.json();
      reports.value = data.reports || [];
      updateStats();
    }
  } catch (error) {
    console.error('Erreur chargement rapports:', error);
  } finally {
    loading.value = false;
  }
};

// Mettre à jour les statistiques
const updateStats = () => {
  stats.value = {
    total: reports.value.length,
    validated: reports.value.filter(r => r.status === 'validated').length,
    pending: reports.value.filter(r => r.status === 'pending').length,
    rejected: reports.value.filter(r => r.status === 'rejected').length
  };
};

// Valider un rapport
const validateReport = async (reportId) => {
  try {
    const res = await fetch(`http://localhost:8080/api/reports/${reportId}/validate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'approve' })
    });

    if (res.ok) {
      const report = reports.value.find(r => r._id === reportId);
      if (report) {
        report.status = 'validated';
        report.validatedAt = new Date();
        updateStats();
      }
    }
  } catch (error) {
    console.error('Erreur validation rapport:', error);
  }
};

// Rejeter un rapport
const rejectReport = async (reportId) => {
  try {
    const res = await fetch(`http://localhost:8080/api/reports/${reportId}/validate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'reject', rejectionReason: 'Non conforme' })
    });

    if (res.ok) {
      const report = reports.value.find(r => r._id === reportId);
      if (report) {
        report.status = 'rejected';
        report.rejectedAt = new Date();
        updateStats();
      }
    }
  } catch (error) {
    console.error('Erreur rejet rapport:', error);
  }
};

// Obtenir la classe de statut
const getStatusClass = (status) => {
  switch (status) {
    case 'validated': return 'bg-green-100 text-green-800 border-green-200';
    case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
    default: return 'bg-yellow-100 text-yellow-800 border-yellow-200';
  }
};

const getStatusIcon = (status) => {
  switch (status) {
    case 'validated': return CheckCircle;
    case 'rejected': return AlertTriangle;
    default: return Clock;
  }
};

onMounted(() => {
  loadReports();
});
</script>

<template>
  <div class="p-6 bg-gray-50 min-h-screen">
    <header class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">Validation des Rapports</h1>
      <p class="text-gray-600">Validez et gérez les rapports soumis par vos agents</p>
    </header>

    <!-- Statistiques -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="p-3 bg-blue-100 rounded-full">
            <FileText class="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <p class="text-sm font-medium text-gray-600">Total Rapports</p>
            <p class="text-2xl font-bold text-gray-900">{{ stats.total }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="p-3 bg-green-100 rounded-full">
            <CheckCircle class="w-6 h-6 text-green-600" />
          </div>
          <div>
            <p class="text-sm font-medium text-gray-600">Validés</p>
            <p class="text-2xl font-bold text-gray-900">{{ stats.validated }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="p-3 bg-yellow-100 rounded-full">
            <Clock class="w-6 h-6 text-yellow-600" />
          </div>
          <div>
            <p class="text-sm font-medium text-gray-600">En Attente</p>
            <p class="text-2xl font-bold text-gray-900">{{ stats.pending }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="p-3 bg-red-100 rounded-full">
            <AlertTriangle class="w-6 h-6 text-red-600" />
          </div>
          <div>
            <p class="text-sm font-medium text-gray-600">Rejetés</p>
            <p class="text-2xl font-bold text-gray-900">{{ stats.rejected }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Liste des rapports -->
    <div class="bg-white rounded-lg shadow">
      <div class="px-6 py-4 border-b border-gray-200">
        <h2 class="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Users class="w-5 h-5" />
          Rapports Soumis
        </h2>
      </div>

      <div v-if="loading" class="p-8 text-center">
        <div class="inline-block w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p class="mt-2 text-gray-600">Chargement des rapports...</p>
      </div>

      <div v-else class="divide-y divide-gray-200">
        <div 
          v-for="report in reports" 
          :key="report._id"
          class="p-6 hover:bg-gray-50 transition-colors"
        >
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <div class="flex items-center gap-3 mb-2">
                <div :class="['p-2 rounded-lg border', getStatusClass(report.status)]">
                  <component 
                    :is="getStatusIcon(report.status)" 
                    class="w-4 h-4"
                  />
                </div>
                <div>
                  <h3 class="text-lg font-medium text-gray-900">{{ report.title }}</h3>
                  <p class="text-sm text-gray-500">
                    Par {{ report.authorName }} • {{ report.department }} • {{ new Date(report.submittedAt).toLocaleDateString('fr-FR') }}
                  </p>
                </div>
              </div>

              <!-- Résumé du rapport -->
              <div class="bg-gray-50 rounded-lg p-4 mb-3">
                <h4 class="text-sm font-medium text-gray-700 mb-2">Résumé</h4>
                <div class="grid grid-cols-2 gap-4 text-sm">
                  <div v-for="(value, key) in report.summary" :key="key">
                    <span class="text-gray-600 capitalize">{{ key }}:</span>
                    <span class="font-medium">{{ value }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex items-center gap-2 ml-4">
              <button
                v-if="report.status === 'pending'"
                @click="validateReport(report._id)"
                class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
              >
                <CheckCircle class="w-4 h-4" />
                Valider
              </button>
              
              <button
                v-if="report.status === 'pending'"
                @click="rejectReport(report._id)"
                class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2"
              >
                <AlertTriangle class="w-4 h-4" />
                Rejeter
              </button>

              <button
                class="px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg"
              >
                <Download class="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>