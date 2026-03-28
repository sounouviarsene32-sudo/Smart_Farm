<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { Target, CheckCircle2, TrendingUp, DollarSign, Plus, Search } from 'lucide-vue-next'
import CampaignCard from '../../components/CampaignCard.vue'
import { useLoginStore } from '@/stores/login.store'
import campaignService from '@/services/campaign.js'
import { useRouter } from 'vue-router'

const router = useRouter()
const loginStore = useLoginStore()

// 1. Rendre le user réactif pour éviter les erreurs au chargement
const currentUser = computed(() => loginStore.getDecodedToken)

// 2. Simplification du nom du département (utilisé pour le titre)
const chefDeptName = computed(() => {
  return currentUser.value?.dept?.name || currentUser.value?.deptName || 'Tableau de bord'
})

const myCampaigns = ref([])
const loading = ref(true)
const stats = ref([])

async function loadCampaigns() {
  try {
    loading.value = true
    const res = await campaignService.getCampaigns()
    // On extrait les données si le service renvoie un objet { data: [...] }
    const allData = res.data || res 

    let filtered = []

    if (currentUser.value?.role === 'chef') {
      // Filtrage par ID de département (plus fiable que le nom)
      const myDeptId = currentUser.value.dept?._id || currentUser.value.dept?.id || currentUser.value.dept
      
      filtered = allData.filter(c => {
        // On vérifie si le département de la campagne correspond à celui du chef
        // Note: 'departement' peut être un tableau ou un objet selon ton schéma
        if (Array.isArray(c.departement)) {
          return c.departement.some(d => (d._id || d.id || d) === myDeptId)
        }
        return (c.departement?._id || c.departement?.id || c.departement) === myDeptId
      })
    } 
    else if (currentUser.value?.role === 'agent') {
      // Filtrage par ID d'agent
      filtered = allData.filter(c => {
        const agentIds = c.agents?.map(a => a._id || a.id || a) || []
        return agentIds.includes(currentUser.value._id)
      })
    } 
    else {
      // Admin ou autre : voit tout
      filtered = allData
    }

    myCampaigns.value = filtered
    calculateStats()
  } catch (err) {
    console.error('Erreur chargement campagnes:', err)
  } finally {
    loading.value = false
  }
}

function calculateStats() {
  const actives = myCampaigns.value.filter(c => c.status !== 'Terminée' && c.progression < 100).length
  const totalBudget = myCampaigns.value.reduce((acc, c) => acc + (Number(c.budgetTotal) || 0), 0)
  
  // Calcul de la progression moyenne
  const avgProg = myCampaigns.value.length 
    ? Math.round(myCampaigns.value.reduce((acc, c) => acc + (c.progression || 0), 0) / myCampaigns.value.length)
    : 0

  stats.value = [
    { title: 'Campagnes Actives', value: actives, icon: Target, color: 'text-blue-600', bg: 'bg-blue-50' },
    { title: 'Total Campagnes', value: myCampaigns.value.length, icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { title: 'Progression Moy.', value: `${avgProg}%`, icon: TrendingUp, color: 'text-purple-600', bg: 'bg-purple-50' },
    { title: 'Budget Total', value: `${totalBudget.toLocaleString()} FCFA`, icon: DollarSign, color: 'text-orange-500', bg: 'bg-orange-50' },
  ]
}

onMounted(() => loadCampaigns())
</script>


  <template>
  <main class="flex-1 lg:ml-64 p-6 lg:p-10 transition-all duration-300 w-full bg-slate-50 min-h-screen space-y-10">
    
    <header class="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
  <div class="space-y-1">
    <div class="flex items-center gap-3">
      <h1 class="text-4xl font-black text-slate-900 tracking-tight">
        {{ chefDeptName }}
      </h1>
      <span v-if="loading" class="animate-pulse text-xs text-slate-400">Chargement...</span>
      <span v-else class="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold uppercase tracking-widest border border-emerald-200">
        Live
      </span>
    </div>
    <p class="text-slate-500 font-medium italic">
      {{ currentUser?.role === 'chef' ? 'Pilotage stratégique des campagnes' : 'Suivi opérationnel des projets' }}
    </p>
  </div>
  </header>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      <div
        v-for="stat in stats"
        :key="stat.title"
        class="relative overflow-hidden group bg-white p-7 rounded-lg border border-slate-100 shadow-sm hover:shadow-xl hover:border-slate-200 transition-all duration-500"
      >
        <div :class="['absolute -right-4 -top-4 w-24 h-24 rounded-full opacity-5 blur-2xl transition-all group-hover:scale-150', stat.bg]"></div>

        <div class="relative flex justify-between items-start">
          <span class="text-xs font-bold text-slate-400 uppercase tracking-widest">{{ stat.title }}</span>
          <div :class="['p-3 rounded-2xl transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6 shadow-sm', stat.bg, stat.color]">
            <component :is="stat.icon" class="w-5 h-5" />
          </div>
        </div>
        
        <div class="mt-6 flex items-baseline gap-2">
          <h3 class="text-4xl font-black text-slate-900 tracking-tighter">{{ stat.value }}</h3>
          <div class="text-[10px] font-bold text-emerald-500 flex items-center bg-emerald-50 px-1.5 py-0.5 rounded">
            <TrendingUp class="w-3 h-3 mr-0.5" /> +2%
          </div>
        </div>
      </div>
    </div>

    <section class="space-y-8">
      <div class="flex items-center gap-4">
        <h2 class="text-2xl font-black text-slate-900 tracking-tight">
          {{ currentUser.role == 'chef' ? 'Campagnes en Cours' : 'Vos Campagnes' }}
        </h2>
        <div class="flex-1 h-[1px] bg-gradient-to-r from-slate-200 to-transparent"></div>
        <div class="flex gap-2">
           <button class="p-2 rounded-lg bg-white border border-slate-200 text-slate-400 hover:text-slate-900 transition-colors">
              <Search class="w-4 h-4" />
           </button>
        </div>
      </div>

      <div class="grid grid-cols-1 gap-6">
        <div  v-if="myCampaigns?.length > 0"
          v-for="(campaign, index) in myCampaigns" 
          :key="campaign.id"
          class="transform transition-all duration-500"
          :style="{ transitionDelay: `${index * 100}ms` }"
        >
          <CampaignCard 
            :campaign="campaign" 
            class="hover:shadow-lg hover:ring-1 hover:ring-slate-200 transition-all"
          />
        </div>
        
        <div v-else class="flex flex-col items-center justify-center py-20 bg-slate-50/50 rounded-[40px] border-slate-200">
          <div class="p-5 bg-white rounded-3xl shadow-sm mb-4">
            <Target class="w-10 h-10 text-slate-300" />
          </div>
          <p class="text-slate-900 font-bold">Silence radio...</p>
          <p class="text-slate-500 text-sm mt-1">Aucune campagne active pour le moment.</p>
        </div>
      </div>
    </section>

  </main>
</template>

<style scoped>
/* Optionnel : Ajout d'une police plus moderne si non définie globalement */
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;800&display=swap');

main {
  font-family: 'Plus Jakarta Sans', sans-serif;
}

/* Animation d'entrée douce pour les cartes */
@keyframes slideUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.grid > div {
  animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) both;
}
</style>

