<script setup>
import { ref, computed, onMounted } from 'vue';
import { useLoginStore } from '../../stores/login.store.js';
import { 
  FileText, 
  Download, 
  Calendar, 
  TrendingUp, 
  Package, 
  Heart,
  DollarSign,
  Search,
  Send,
  Users,
  UserCheck
} from 'lucide-vue-next';

const loading = ref(false);
const campaigns = ref([]);
const selectedCampaign = ref('');
const startDate = ref('');
const endDate = ref('');
const reportType = ref('financier');
const reports = ref([]);
const showTransferModal = ref(false);
const selectedReport = ref(null);
const transferData = ref({
  recipientType: 'chef',
  recipientId: '',
  message: ''
});

// Utiliser le store de connexion
const loginStore = useLoginStore();

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
    const endpoint = `http://localhost:8080/api/reports/generate/${reportType.value}`;
    const payload = {
      campaignId: selectedCampaign.value,
      startDate: startDate.value,
      endDate: endDate.value,
      authorId: 'agent123', // ID simulé de l'agent
      authorName: 'Agent User', // Nom simulé
      authorRole: 'agent'
    };

    // Récupérer le token depuis le store
    const token = loginStore.token;
    if (!token) {
      alert('Vous devez être connecté pour générer un rapport');
      return;
    }
    
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };

    const res = await fetch(endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      const data = await res.json();
      reports.value.unshift(data.report);
      alert('Rapport généré avec succès!');
    } else {
      const errorData = await res.json();
      alert(errorData.message || 'Erreur lors de la génération du rapport');
    }
  } catch (error) {
    console.error('Erreur génération rapport:', error);
    alert('Erreur lors de la génération du rapport');
  } finally {
    loading.value = false;
  }
};

// Télécharger un rapport
const downloadReport = async (reportId) => {
  try {
    const token = loginStore.token;
    if (!token) {
      alert('Vous devez être connecté pour télécharger un rapport');
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
    } else {
      alert('Erreur lors du téléchargement');
    }
  } catch (error) {
    console.error('Erreur téléchargement rapport:', error);
    alert('Erreur lors du téléchargement');
  }
};

// Ouvrir le modal de transfert
const openTransferModal = (report) => {
  selectedReport.value = report;
  transferData.value = {
    recipientType: 'chef',
    recipientId: '',
    message: ''
  };
  showTransferModal.value = true;
};

// Transférer un rapport
const transferReport = async () => {
  if (!selectedReport.value || !transferData.value.recipientId) {
    alert('Veuillez sélectionner un destinataire');
    return;
  }

  try {
    const token = loginStore.token;
    if (!token) {
      alert('Vous devez être connecté pour transférer un rapport');
      return;
    }
    
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };

    const res = await fetch('http://localhost:8080/api/reports/transfer', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        reportId: selectedReport.value._id,
        recipientType: transferData.value.recipientType,
        recipientId: transferData.value.recipientId,
        message: transferData.value.message
      })
    });

    if (res.ok) {
      const data = await res.json();
      alert(data.message);
      showTransferModal.value = false;
      // Mettre à jour le statut du rapport
      const reportIndex = reports.value.findIndex(r => r._id === selectedReport.value._id);
      if (reportIndex !== -1) {
        reports.value[reportIndex].status = 'transferred';
      }
    } else {
      const errorData = await res.json();
      alert(errorData.message || 'Erreur lors du transfert');
    }
  } catch (error) {
    console.error('Erreur transfert rapport:', error);
    alert('Erreur lors du transfert');
  }
};

// Charger les rapports existants
const loadReports = async () => {
  try {
    const token = loginStore.token;
    if (!token) {
      console.log('Utilisateur non connecté, chargement des rapports annulé');
      return;
    }
    
    const headers = {
      'Authorization': `Bearer ${token}`
    };

    const res = await fetch('http://localhost:8080/api/reports/all?authorId=agent123', {
      headers
    });
    
    if (res.ok) {
      const data = await res.json();
      reports.value = data.reports || [];
    }
  } catch (error) {
    console.error('Erreur chargement rapports:', error);
  }
};

// Obtenir les destinataires possibles
const getRecipients = computed(() => {
  if (transferData.value.recipientType === 'chef') {
    return [
      { id: 'chef1', name: 'Chef Volaille', department: 'Volaille' },
      { id: 'chef2', name: 'Chef Bovins', department: 'Bovins' },
      { id: 'chef3', name: 'Chef Ovins', department: 'Ovins' }
    ];
  } else {
    return [
      { id: 'admin1', name: 'Administrateur Principal', role: 'Admin' }
    ];
  }
});

// Formater la date
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('fr-FR');
};

onMounted(() => {
  loadCampaigns();
  loadReports();
});
</script>

<template>
  <main class="flex-1 lg:ml-64 p-6 lg:p-10 bg-red-50 min-h-screen">
    <header class="mb-8">
      <h1 class="text-3xl font-black text-slate-900 tracking-tight">Rapports Agent</h1>
      <p class="text-slate-500 text-sm mt-1">Générez et transférez vos rapports</p>
    </header>

    <!-- Formulaire de génération -->
    <section class="bg-white rounded-xl shadow-sm p-6 mb-8">
      <h2 class="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
        <FileText class="w-5 h-5 text-slate-400" />
        Générer un Nouveau Rapport
      </h2>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-2">Type de Rapport</label>
          <select v-model="reportType" class="w-full px-3 py-2 border border-slate-300 rounded-lg">
            <option v-for="type in reportTypes" :key="type.value" :value="type.value">
              {{ type.label }}
            </option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-slate-700 mb-2">Campagne</label>
          <select v-model="selectedCampaign" class="w-full px-3 py-2 border border-slate-300 rounded-lg">
            <option value="">Sélectionner une campagne</option>
            <option v-for="campaign in campaigns" :key="campaign._id" :value="campaign._id">
              {{ campaign.name }}
            </option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-slate-700 mb-2">Date Début</label>
          <input 
            v-model="startDate" 
            type="date" 
            class="w-full px-3 py-2 border border-slate-300 rounded-lg"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-slate-700 mb-2">Date Fin</label>
          <input 
            v-model="endDate" 
            type="date" 
            class="w-full px-3 py-2 border border-slate-300 rounded-lg"
          />
        </div>
      </div>

      <button 
        @click="generateReport"
        :disabled="loading"
        class="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 flex items-center gap-2"
      >
        <FileText class="w-4 h-4" />
        {{ loading ? 'Génération...' : 'Générer le Rapport' }}
      </button>
    </section>

    <!-- Liste des rapports -->
    <section>
      <h2 class="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
        <Search class="w-5 h-5 text-slate-400" />
        Mes Rapports
      </h2>

      <div class="bg-white rounded-xl shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-slate-50 border-b">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Type</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Titre</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Période</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Statut</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-200">
              <tr v-for="report in reports" :key="report._id" class="hover:bg-slate-50">
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="[
                    'px-2 py-1 text-xs font-medium rounded-full',
                    reportTypes.find(t => t.value === report.type)?.color || 'text-gray-600'
                  ]">
                    {{ reportTypes.find(t => t.value === report.type)?.label || report.type }}
                  </span>
                </td>
                <td class="px-6 py-4 text-sm text-slate-900">
                  {{ report.title }}
                </td>
                <td class="px-6 py-4 text-sm text-slate-600">
                  {{ formatDate(report.period?.startDate) }} - {{ formatDate(report.period?.endDate) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="[
                    'px-2 py-1 text-xs font-medium rounded-full',
                    report.status === 'draft' ? 'bg-gray-100 text-gray-800' :
                    report.status === 'transferred' ? 'bg-blue-100 text-blue-800' :
                    report.status === 'validated' ? 'bg-green-100 text-green-800' :
                    'bg-red-100 text-red-800'
                  ]">
                    {{ report.status === 'draft' ? 'Brouillon' :
                       report.status === 'transferred' ? 'Transféré' :
                       report.status === 'validated' ? 'Validé' :
                       'Rejeté' }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm">
                  <div class="flex gap-2">
                    <button 
                      @click="downloadReport(report._id)"
                      class="text-emerald-600 hover:text-emerald-800 flex items-center gap-1"
                    >
                      <Download class="w-4 h-4" />
                      Télécharger
                    </button>
                    <button 
                      v-if="report.status === 'draft'"
                      @click="openTransferModal(report)"
                      class="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                    >
                      <Send class="w-4 h-4" />
                      Transférer
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>

    <!-- Modal de transfert -->
    <div v-if="showTransferModal" class="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 class="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
          <Send class="w-5 h-5" />
          Transférer le Rapport
        </h3>
        
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-2">Destinataire</label>
            <select 
              v-model="transferData.recipientType" 
              class="w-full px-3 py-2 border border-slate-300 rounded-lg mb-2"
            >
              <option value="chef">Chef de Département</option>
              <option value="admin">Administrateur</option>
            </select>
            
            <select 
              v-model="transferData.recipientId" 
              class="w-full px-3 py-2 border border-slate-300 rounded-lg"
            >
              <option value="">Sélectionner un destinataire</option>
              <option 
                v-for="recipient in getRecipients" 
                :key="recipient.id" 
                :value="recipient.id"
              >
                {{ recipient.name }} {{ recipient.department ? `(${recipient.department})` : '' }}
              </option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-2">Message (optionnel)</label>
            <textarea 
              v-model="transferData.message" 
              class="w-full px-3 py-2 border border-slate-300 rounded-lg"
              rows="3"
              placeholder="Ajouter un message pour le destinataire..."
            ></textarea>
          </div>
        </div>
        
        <div class="flex gap-3 mt-6">
          <button 
            @click="showTransferModal = false"
            class="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50"
          >
            Annuler
          </button>
          <button 
            @click="transferReport"
            class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2"
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
