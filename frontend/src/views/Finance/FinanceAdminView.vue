<script setup>
import { ref, onMounted, computed } from 'vue'
import { Pie } from 'vue-chartjs'
import {
  DollarSign,
  CreditCard,
  Wallet,
  Percent,
  TrendingUp,
  ArrowUpRight,
  ArrowDownLeft,
  Building2,
  LayoutDashboard,
} from 'lucide-vue-next'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'

ChartJS.register(ArcElement, Tooltip, Legend)

// Données dynamiques
const loading = ref(false)
const campaigns = ref([])
const selectedCampaign = ref('')
const transactions = ref([])
const financialStats = ref([])
const departmentsData = ref([])

// Calculer les stats financières
const calculateStats = () => {
  const totalRevenus = transactions.value
    .filter(t => t.type === 'revenu')
    .reduce((sum, t) => sum + t.amount, 0)
  
  const totalDepenses = transactions.value
    .filter(t => t.type === 'depense')
    .reduce((sum, t) => sum + t.amount, 0)
  
  const beneficeNet = totalRevenus - totalDepenses
  const marge = totalRevenus > 0 ? (beneficeNet / totalRevenus * 100) : 0

  financialStats.value = [
    { 
      title: 'Revenus Totaux', 
      value: new Intl.NumberFormat('fr-FR').format(totalRevenus) + ' FCFA', 
      icon: DollarSign, 
      color: 'emerald',
      change: '+12.5%',
      trend: 'up'
    },
    { 
      title: 'Dépenses Totales', 
      value: new Intl.NumberFormat('fr-FR').format(totalDepenses) + ' FCFA', 
      icon: CreditCard, 
      color: 'orange',
      change: '+8.2%',
      trend: 'up'
    },
    { 
      title: 'Bénéfice Net', 
      value: new Intl.NumberFormat('fr-FR').format(beneficeNet) + ' FCFA', 
      icon: Wallet, 
      color: 'blue',
      change: '+18.7%',
      trend: 'up'
    },
    { 
      title: 'Marge', 
      value: marge.toFixed(1) + '%', 
      icon: Percent, 
      color: 'purple',
      change: '+2.3%',
      trend: 'up'
    },
  ]
}

// Calculer les données par département
const calculateDepartmentData = () => {
  const deptMap = new Map()
  
  transactions.value.forEach(t => {
    if (!deptMap.has(t.category)) {
      deptMap.set(t.category, { revenus: 0, depenses: 0 })
    }
    
    const dept = deptMap.get(t.category)
    if (t.type === 'revenu') {
      dept.revenus += t.amount
    } else {
      dept.depenses += t.amount
    }
  })

  departmentsData.value = [
    { name: 'Ventes', revenus: deptMap.get('vente')?.revenus || 0, depenses: 0, color: 'bg-emerald-500' },
    { name: 'Alimentation', revenus: 0, depenses: deptMap.get('alimentation')?.depenses || 0, color: 'bg-blue-500' },
    { name: 'Médicaments', revenus: 0, depenses: deptMap.get('medicament')?.depenses || 0, color: 'bg-orange-500' },
    { name: 'Main d\'œuvre', revenus: 0, depenses: deptMap.get('main_oeuvre')?.depenses || 0, color: 'bg-purple-500' },
  ]
}

// Données pour le graphique pie
const pieData = computed(() => {
  const categoryTotals = {}
  
  transactions.value
    .filter(t => t.type === 'depense')
    .forEach(t => {
      categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount
    })

  const total = Object.values(categoryTotals).reduce((sum, val) => sum + val, 0)
  
  return {
    labels: Object.keys(categoryTotals).map(cat => 
      cat.charAt(0).toUpperCase() + cat.slice(1).replace('_', ' ')
    ),
    datasets: [
      {
        data: Object.values(categoryTotals),
        backgroundColor: ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6'],
        borderWidth: 0,
        hoverOffset: 20,
      },
    ],
  }
})

const pieOptions = {
  plugins: { legend: { display: false } },
  maintainAspectRatio: false,
  cutout: '70%',
}

// Charger les campagnes
const loadCampaigns = async () => {
  try {
    const res = await fetch('http://localhost:8080/api/campaigns')
    if (res.ok) {
      campaigns.value = await res.json()
      if (campaigns.value.length > 0) {
        selectedCampaign.value = campaigns.value[0]._id
        await loadTransactions()
      }
    }
  } catch (error) {
    console.error('Erreur chargement campagnes:', error)
  }
}

// Charger les transactions
const loadTransactions = async () => {
  if (!selectedCampaign.value) return
  
  loading.value = true
  try {
    const res = await fetch(`http://localhost:8080/api/finance?campaignId=${selectedCampaign.value}`)
    if (res.ok) {
      transactions.value = await res.json()
      calculateStats()
      calculateDepartmentData()
    }
  } catch (error) {
    console.error('Erreur chargement transactions:', error)
  } finally {
    loading.value = false
  }
}

// Ajouter une transaction
const addTransaction = async (transactionData) => {
  try {
    const res = await fetch('http://localhost:8080/api/finance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...transactionData,
        campaignId: selectedCampaign.value
      })
    })
    
    if (res.ok) {
      await loadTransactions()
      showAddTransactionModal.value = false
    }
  } catch (error) {
    console.error('Erreur ajout transaction:', error)
  }
}

// Helper pour formater les prix
const formatPrice = (val) => new Intl.NumberFormat('fr-FR').format(val) + ' FCFA'
const getProgress = (dep, rev) => Math.min((dep / rev) * 100, 100)

// Modal pour ajouter une transaction
const showAddTransactionModal = ref(false)
const newTransaction = ref({
  type: 'revenu',
  category: 'vente',
  amount: 0,
  description: ''
})

onMounted(() => {
  loadCampaigns()
})
</script>

<template>
  <main class="flex-1 lg:ml-64 p-6 lg:p-10 bg-red-50 min-h-screen space-y-10">
    <header>
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-3xl font-black text-slate-900 tracking-tight">Finances</h1>
        </div>
        
        <!-- Sélecteur de campagne -->
        <div class="flex items-center gap-4">
          <select 
            v-model="selectedCampaign" 
            @change="loadTransactions"
            class="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium"
            :disabled="loading"
          >
            <option value="">Sélectionner une campagne</option>
            <option v-for="campaign in campaigns" :key="campaign._id" :value="campaign._id">
              {{ campaign.name }}
            </option>
          </select>
          
          <button 
            @click="showAddTransactionModal = true"
            class="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 text-sm font-medium"
          >
            + Ajouter Transaction
          </button>
        </div>
      </div>
    </header>

    <!-- Loading -->
    <div v-if="loading" class="flex justify-center items-center py-20">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
    </div>

    <div v-else class="space-y-10">
      <!-- Stats Globales -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div
          v-for="stat in financialStats"
          :key="stat.title"
          class="group bg-white p-6 rounded-lg border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
        >
          <div class="flex justify-between items-center mb-4">
            <div
              class="p-3 rounded-2xl transition-transform"
              :class="[`bg-${stat.color}-50`, `text-${stat.color}-600`]"
            > 
              <component :is="stat.icon" class="w-5 h-5" /> 
            </div>
            <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              {{ stat.title }}
            </span>
          </div>
          <div class="text-2xl font-black text-slate-900">
            {{ stat.value }}
          </div>
          <div class="flex items-center gap-1 mt-2">
            <component 
              :is="stat.trend === 'up' ? ArrowUpRight : ArrowDownLeft" 
              :class="['w-3 h-3', stat.trend === 'up' ? 'text-emerald-500' : 'text-red-500']"
            />
            <span :class="['text-xs font-medium', stat.trend === 'up' ? 'text-emerald-500' : 'text-red-500']">
              {{ stat.change }}
            </span>
          </div>
        </div>
      </div>

      <!-- Analyse par Département -->
      <section class="space-y-6">
        <div class="flex items-center justify-between">
          <h2 class="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Building2 class="w-5 h-5 text-slate-400" /> Analyse par Département
          </h2>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div
            v-for="dept in departmentsData"
            :key="dept.name"
            class="bg-white p-6 rounded-xl border border-slate-100 shadow-sm"
          >
            <h4 class="font-bold text-slate-900 mb-6">{{ dept.name }}</h4>

            <div class="space-y-6">
              <div>
                <div class="flex justify-between text-[11px] font-bold uppercase mb-2">
                  <span class="text-slate-400 tracking-tighter">Revenus</span>
                  <span class="text-emerald-500">{{ formatPrice(dept.revenus) }}</span>
                </div>
                <div class="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div class="h-full bg-emerald-500 rounded-full" style="width: 100%"></div>
                </div>
              </div>

              <div>
                <div class="flex justify-between text-[11px] font-bold uppercase mb-2">
                  <span class="text-slate-400 tracking-tighter">Dépenses</span>
                  <span class="text-orange-500">{{ formatPrice(dept.depenses) }}</span>
                </div>
                <div class="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div
                    class="h-full bg-orange-500 rounded-full"
                    :style="{ width: getProgress(dept.depenses, dept.revenus) + '%' }"
                  ></div>
                </div>
                <p class="text-[9px] text-slate-400 mt-2 italic">
                  Absorbe {{ Math.round(getProgress(dept.depenses, dept.revenus)) }}% des revenus du dept.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Graphique et Transactions -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Graphique -->
        <div class="bg-slate-900 p-8 shadow-2xl text-white relative overflow-hidden">
          <div class="relative z-10">
            <h3 class="font-bold mb-8 text-lg opacity-80 uppercase tracking-widest">
              Répartition des Dépenses
            </h3>
            <div class="flex flex-col md:flex-row items-center gap-10">
              <div class="w-44 h-44">
                <Pie :data="pieData" :options="pieOptions" />
              </div>
              <div class="flex-1 space-y-4 w-full">
                <div
                  v-for="(label, index) in pieData.labels"
                  :key="label"
                  class="flex justify-between items-center"
                >
                  <div class="flex items-center gap-3">
                    <span
                      class="w-2 h-2 rounded-full"
                      :style="{ backgroundColor: pieData.datasets[0].backgroundColor[index] }"
                    ></span>
                    <span class="text-xs font-medium text-white/60">{{ label }}</span>
                  </div>
                  <span class="text-xs font-bold">{{ pieData.datasets[0].data[index] }} FCFA </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Transactions récentes -->
        <div class="bg-white rounded-lg shadow-sm">
          <div class="p-6 border-b border-slate-200">
            <h3 class="font-bold text-slate-900">Transactions Récentes</h3>
          </div>
          <div class="max-h-96 overflow-y-auto">
            <div class="divide-y divide-slate-200">
              <div 
                v-for="transaction in transactions.slice(0, 10)" 
                :key="transaction._id" 
                class="p-4 hover:bg-slate-50 transition-colors"
              >
                <div class="flex justify-between items-start">
                  <div>
                    <p class="font-medium text-slate-900">
                      {{ transaction.description || 'Transaction sans description' }}
                    </p>
                    <p class="text-sm text-slate-500 mt-1">
                      {{ new Date(transaction.date).toLocaleDateString('fr-FR') }} • {{ transaction.category }}
                    </p>
                  </div>
                  <div class="text-right">
                    <span :class="[
                      'px-2 py-1 text-xs font-medium rounded-full',
                      transaction.type === 'revenu' 
                        ? 'bg-emerald-100 text-emerald-800' 
                        : 'bg-red-100 text-red-800'
                    ]">
                      {{ transaction.type === 'revenu' ? 'Revenu' : 'Dépense' }}
                    </span>
                    <p class="font-bold mt-1" :class="transaction.type === 'revenu' ? 'text-emerald-600' : 'text-red-600'">
                      {{ transaction.type === 'revenu' ? '+' : '-' }} {{ formatPrice(transaction.amount) }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Ajout Transaction -->
   <div v-if="showAddTransactionModal" class="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 class="text-lg font-bold text-slate-900 mb-4">Ajouter une Transaction</h3>
        
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Type</label>
            <select v-model="newTransaction.type" class="w-full px-3 py-2 border border-slate-300 rounded-lg">
              <option value="revenu">Revenu</option>
              <option value="depense">Dépense</option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Catégorie</label>
            <select v-model="newTransaction.category" class="w-full px-3 py-2 border border-slate-300 rounded-lg">
              <option value="vente">Vente</option>
              <option value="alimentation">Alimentation</option>
              <option value="medicament">Médicament</option>
              <option value="main_oeuvre">Main d'œuvre</option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Montant (FCFA)</label>
            <input 
              v-model.number="newTransaction.amount" 
              type="number" 
              class="w-full px-3 py-2 border border-slate-300 rounded-lg"
              placeholder="0"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Description</label>
            <input 
              v-model="newTransaction.description" 
              type="text" 
              class="w-full px-3 py-2 border border-slate-300 rounded-lg"
              placeholder="Description de la transaction"
            />
          </div>
        </div>
        
        <div class="flex gap-3 mt-6">
          <button 
            @click="showAddTransactionModal = false"
            class="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50"
          >
            Annuler
          </button>
          <button 
            @click="addTransaction(newTransaction)"
            class="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
          >
            Ajouter
          </button>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
</style>
