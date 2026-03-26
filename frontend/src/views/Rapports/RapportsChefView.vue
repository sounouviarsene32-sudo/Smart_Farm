<script setup>
import { ref, onMounted } from 'vue';
import { useLoginStore } from '../../stores/login.store.js';
import { useToast } from 'vue-toastification';
import Swal from 'sweetalert2';
import { 
  FileText, 
  Users, 
  TrendingUp, 
  BarChart3,
  Calendar,
  Download,
  CheckCircle,
  Clock,
  AlertTriangle,
  Send,
  UserCheck,
  Eye,
  MessageSquare
} from 'lucide-vue-next';

const loading = ref(false);
const reports = ref([]);
const stats = ref({
  total: 0,
  validated: 0,
  pending: 0,
  rejected: 0
});
const showValidationModal = ref(false);
const selectedReport = ref(null);
const validationData = ref({
  action: 'validate',
  comment: ''
});
const showTransferToAdminModal = ref(false);
const transferMessage = ref('');

// Utiliser le store de connexion
const loginStore = useLoginStore();
const toast = useToast();

// Charger les rapports soumis par les agents
const loadReports = async () => {
  loading.value = true;
  try {
    const token = loginStore.token;
    if (!token) {
      console.log('Utilisateur non connecté, chargement des rapports annulé');
      return;
    }
    
    const headers = {
      'Authorization': `Bearer ${token}`
    };
    
    const res = await fetch('http://localhost:8080/api/reports/pending/role/chef', {
      headers
    });
    
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
    pending: reports.value.filter(r => r.status === 'transferred').length,
    rejected: reports.value.filter(r => r.status === 'rejected').length
  };
};

// Ouvrir le modal de validation
const openValidationModal = (report) => {
  selectedReport.value = report;
  validationData.value = {
    action: 'validate',
    comment: ''
  };
  showValidationModal.value = true;
};

// Valider ou rejeter un rapport
const validateReport = async () => {
  if (!selectedReport.value) return;

  // Confirmation avec SweetAlert2
  const actionText = validationData.value.action === 'validate' ? 'valider' : 'rejeter';
  const actionIcon = validationData.value.action === 'validate' ? 'success' : 'warning';
  
  const result = await Swal.fire({
    title: `Confirmer la ${actionText}?`,
    text: `Êtes-vous sûr de vouloir ${actionText} ce rapport?${validationData.value.comment ? '\n\nCommentaire: ' + validationData.value.comment : ''}`,
    icon: actionIcon,
    showCancelButton: true,
    confirmButtonColor: validationData.value.action === 'validate' ? '#16a34a' : '#dc2626',
    cancelButtonColor: '#6b7280',
    confirmButtonText: `Oui, ${actionText}`,
    cancelButtonText: 'Annuler'
  });

  if (!result.isConfirmed) {
    return;
  }

  try {
    const token = loginStore.token;
    if (!token) {
      toast.error('Vous devez être connecté pour valider un rapport');
      return;
    }
    
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };

    const res = await fetch(`http://localhost:8080/api/reports/validate/${selectedReport.value._id}`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        action: validationData.value.action,
        comment: validationData.value.comment
      })
    });

    if (res.ok) {
      const data = await res.json();
      toast.success(data.message);
      showValidationModal.value = false;
      loadReports(); // Recharger les rapports
    }
  } catch (error) {
    console.error('Erreur validation rapport:', error);
    toast.error('Erreur lors de la validation');
  }
};

// Télécharger un rapport
const downloadReport = async (reportId) => {
  try {
    const token = loginStore.token;
    if (!token) {
      toast.error('Vous devez être connecté pour télécharger un rapport');
      return;
    }
    
    const headers = {
      'Authorization': `Bearer ${token}`
    };

    const res = await fetch(`http://localhost:8080/api/reports/download/${reportId}`, {
      headers
    });
    
    if (res.ok) {
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `rapport_${reportId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success('Téléchargement réussi');
    }
  } catch (error) {
    console.error('Erreur téléchargement rapport:', error);
    toast.error('Erreur lors du téléchargement');
  }
};

// Ouvrir le modal de transfert vers l'admin
const openTransferToAdminModal = (report) => {
  selectedReport.value = report;
  transferMessage.value = '';
  showTransferToAdminModal.value = true;
};

// Transférer à l'admin
const transferToAdmin = async () => {
  if (!selectedReport.value) return;

  // Confirmation avec SweetAlert2
  const result = await Swal.fire({
    title: 'Confirmer le transfert à l\'admin?',
    text: `Êtes-vous sûr de vouloir transférer ce rapport validé à l'administrateur?${transferMessage.value ? '\n\nMessage: ' + transferMessage.value : ''}`,
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#750505',
    cancelButtonColor: '#6b7280',
    confirmButtonText: 'Oui, transférer',
    cancelButtonText: 'Annuler'
  });

  if (!result.isConfirmed) {
    return;
  }

  try {
    const token = loginStore.token;
    if (!token) {
      toast.error('Vous devez être connecté pour transférer un rapport');
      return;
    }
    
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };

    const res = await fetch('http://localhost:8080/api/reports/transfer-to-admin', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        reportId: selectedReport.value._id,
        message: transferMessage.value
      })
    });

    if (res.ok) {
      const data = await res.json();
      toast.success(data.message);
      showTransferToAdminModal.value = false;
      loadReports(); // Recharger les rapports
    }
  } catch (error) {
    console.error('Erreur transfert admin:', error);
    toast.error('Erreur lors du transfert');
  }
};

// Obtenir la classe de style pour le statut
const getStatusClass = (status) => {
  switch (status) {
    case 'transferred':
      return 'bg-blue-100 text-blue-800';
    case 'validated':
      return 'bg-green-100 text-green-800';
    case 'rejected':
      return 'bg-blue-100 text-blue-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

// Obtenir l'icône pour le statut
const getStatusIcon = (status) => {
  switch (status) {
    case 'transferred':
      return Clock;
    case 'validated':
      return CheckCircle;
    case 'rejected':
      return AlertTriangle;
    default:
      return FileText;
  }
};

// Formater la date
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('fr-FR');
};

onMounted(() => {
  loadReports();
});
</script>

<template>
  <main class="flex-1 lg:ml-64 p-6 lg:p-10 bg-slate-50 min-h-screen">
    <header class="mb-8">
      <h1 class="text-3xl font-black text-slate-900 tracking-tight">Rapports Chef</h1>
      <p class="text-slate-500 text-sm mt-1">Validez et transférez les rapports des agents</p>
    </header>

    <!-- Statistiques -->
    <section class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div class="bg-white p-6 rounded-lg shadow-sm">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-slate-500">Total Rapports</p>
            <p class="text-2xl font-bold text-slate-900">{{ stats.total }}</p>
          </div>
          <FileText class="w-8 h-8 text-slate-400" />
        </div>
      </div>

      <div class="bg-white p-6 rounded-lg shadow-sm">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-slate-500">En Attente</p>
            <p class="text-2xl font-bold text-blue-600">{{ stats.pending }}</p>
          </div>
          <Clock class="w-8 h-8 text-blue-400" />
        </div>
      </div>

      <div class="bg-white p-6 rounded-lg shadow-sm">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-slate-500">Validés</p>
            <p class="text-2xl font-bold text-emerald-600">{{ stats.validated }}</p>
          </div>
          <CheckCircle class="w-8 h-8 text-emerald-400" />
        </div>
      </div>

      <div class="bg-white p-6 rounded-lg shadow-sm">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-slate-500">Rejetés</p>
            <p class="text-2xl font-bold text-red-600">{{ stats.rejected }}</p>
          </div>
          <AlertTriangle class="w-8 h-8 text-red-400" />
        </div>
      </div>
    </section>

    <!-- Liste des rapports -->
    <section>
      <h2 class="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
        <Eye class="w-5 h-5 text-slate-400" />
        Rapports à Traiter
      </h2>

      <div v-if="loading" class="flex justify-center items-center py-20">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>

      <div v-else class="bg-white rounded-xl shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-slate-50 border-b">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Agent</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Type</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Titre</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Période</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Statut</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-200">
              <tr v-for="report in reports" :key="report._id" class="hover:bg-slate-50">
                <td class="px-6 py-4">
                  <div class="flex items-center gap-2">
                    <Users class="w-4 h-4 text-slate-400" />
                    <div>
                      <p class="text-sm font-medium text-slate-900">{{ report.authorName }}</p>
                      <p class="text-xs text-slate-500">{{ report.authorRole }}</p>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <span class="px-2 py-1 text-xs font-medium rounded-full bg-slate-100 text-slate-800">
                    {{ report.type?.charAt(0).toUpperCase() + report.type?.slice(1) }}
                  </span>
                </td>
                <td class="px-6 py-4 text-sm text-slate-900">
                  {{ report.title }}
                </td>
                <td class="px-6 py-4 text-sm text-slate-600">
                  {{ formatDate(report.period?.startDate) }} - {{ formatDate(report.period?.endDate) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center gap-2">
                    <component 
                      :is="getStatusIcon(report.status)" 
                      class="w-4 h-4"
                      :class="report.status === 'transferred' ? 'text-blue-500' :
                              report.status === 'validated' ? 'text-emerald-500' :
                              report.status === 'rejected' ? 'text-red-500' : 'text-slate-400'"
                    />
                    <span :class="[
                      'px-2 py-1 text-xs font-medium rounded-full',
                      getStatusClass(report.status)
                    ]">
                      {{ report.status === 'transferred' ? 'Transféré' :
                         report.status === 'validated' ? 'Validé' :
                         report.status === 'rejected' ? 'Rejeté' :
                         'Brouillon' }}
                    </span>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex gap-2">
                    <button 
                      @click="downloadReport(report._id)"
                      class="text-emerald-600 hover:text-emerald-800 flex items-center gap-1"
                      title="Télécharger"
                    >
                      <Download class="w-4 h-4" />
                    </button>
                    
                    <button 
                      v-if="report.status === 'transferred'"
                      @click="openValidationModal(report)"
                      class="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                      title="Valider/Rejeter"
                    >
                      <UserCheck class="w-4 h-4" />
                    </button>
                    
                    <button 
                      v-if="report.status === 'validated'"
                      @click="openTransferToAdminModal(report)"
                      class="text-purple-600 hover:text-purple-800 flex items-center gap-1"
                      title="Transférer à l'admin"
                    >
                      <Send class="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>

    <!-- Modal de validation -->
    <div v-if="showValidationModal" class="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 class="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
          <UserCheck class="w-5 h-5" />
          Validation du Rapport
        </h3>
        
        <div class="mb-4">
          <p class="text-sm text-slate-600">
            Rapport: <span class="font-medium">{{ selectedReport?.title }}</span>
          </p>
          <p class="text-sm text-slate-600">
            De: <span class="font-medium">{{ selectedReport?.authorName }}</span>
          </p>
        </div>
        
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-2">Action</label>
            <div class="flex gap-4">
              <label class="flex items-center">
                <input 
                  v-model="validationData.action" 
                  value="validate" 
                  type="radio" 
                  class="mr-2"
                />
                <span class="text-sm">Valider</span>
              </label>
              <label class="flex items-center">
                <input 
                  v-model="validationData.action" 
                  value="reject" 
                  type="radio" 
                  class="mr-2"
                />
                <span class="text-sm">Rejeter</span>
              </label>
            </div>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-2">Commentaire</label>
            <textarea 
              v-model="validationData.comment" 
              class="w-full px-3 py-2 border border-slate-300 rounded-lg"
              rows="3"
              :placeholder="validationData.action === 'reject' ? 'Raison du rejet...' : 'Commentaire optionnel...'"
            ></textarea>
          </div>
        </div>
        
        <div class="flex gap-3 mt-6">
          <button 
            @click="showValidationModal = false"
            class="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50"
          >
            Annuler
          </button>
          <button 
            @click="validateReport"
            :class="[
              'flex-1 px-4 py-2 rounded-lg flex items-center justify-center gap-2',
              validationData.action === 'validate' 
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                : 'bg-blue-600 hover:bg-blue-500 text-white transition-all'
            ]"
          >
            <component 
              :is="validationData.action === 'validate' ? CheckCircle : AlertTriangle" 
              class="w-4 h-4" 
            />
            {{ validationData.action === 'validate' ? 'Valider' : 'Rejeter' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Modal de transfert vers l'admin -->
    <div v-if="showTransferToAdminModal" class="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 class="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
          <Send class="w-5 h-5" />
          Transférer à l'Administrateur
        </h3>
        
        <div class="mb-4">
          <p class="text-sm text-slate-600">
            Rapport: <span class="font-medium">{{ selectedReport?.title }}</span>
          </p>
        </div>
        
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-2">Message pour l'admin (optionnel)</label>
            <textarea 
              v-model="transferMessage" 
              class="w-full px-3 py-2 border border-slate-300 rounded-lg"
              rows="3"
              placeholder="Ajouter un message pour l'administrateur..."
            ></textarea>
          </div>
        </div>
        
        <div class="flex gap-3 mt-6">
          <button 
            @click="showTransferToAdminModal = false"
            class="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50"
          >
            Annuler
          </button>
          <button 
            @click="transferToAdmin"
            class="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center justify-center gap-2"
          >
            <Send class="w-4 h-4" />
            Transférer
          </button>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
</style>
