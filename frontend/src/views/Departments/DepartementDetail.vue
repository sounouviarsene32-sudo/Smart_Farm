<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  Building2, UserCircle, Mail, Phone, ChevronLeft,
  Users, Beef, TrendingUp, Download, ShieldCheck
} from 'lucide-vue-next'
import departementService from '@/services/departement.js'


const router = useRouter()
const route = useRoute()
const departementId = route.params.id

const dept = ref(null)
const loading = ref(true)
const error = ref(null)
const isExporting = ref(false)
const pdfContent = ref(null)

function formatMoney(value) {
  return new Intl.NumberFormat('fr-FR').format(value) + ' FCFA'
}

async function loadDepartement() {
  try {
    loading.value = true
    const data = await departementService.getDepartementById(departementId)
    dept.value = {
      name: data.name,
      agents: data.stats?.agents || 0,
      animals: data.stats?.animals || 0,
      campagnes: data.stats?.campagnes || 0,
      chef: data.manager?.name || 'Responsable non assigné',
      email: data.manager?.email || 'contact@ferme.ci',
      phone: data.manager?.phone || '+225 -- -- -- --',
      perf: data.stats?.perf || '0%',
      revenus: data.stats?.revenus || 0,
    }
  } catch (err) {
    error.value = 'Erreur lors de la récupération des données.'
  } finally {
    loading.value = false
  }
}

function forceHexColors(rootEl) {
  const elements = rootEl.querySelectorAll('*')
  elements.forEach(el => {
    const style = getComputedStyle(el)
    // Couleurs textuelles
    if (style.color.includes('oklch') || style.color.includes('lab')) {
      el.style.color = '#000000'
    }
    // Couleurs de fond
    if (style.backgroundColor.includes('oklch') || style.backgroundColor.includes('lab')) {
      el.style.backgroundColor = '#ffffff'
    }
    // Bordures
    if (style.borderColor.includes('oklch') || style.borderColor.includes('lab')) {
      el.style.borderColor = '#000000'
    }
  })
}

async function exportToPDF() {
  if (!pdfContent.value) return
  isExporting.value = true
  try {
    await nextTick()

    // rendre temporairement les sections print-only visibles
    const printSections = pdfContent.value.querySelectorAll('.print-only')
    printSections.forEach(el => el.classList.remove('hidden'))

    // Forcer les couleurs HEX pour html2canvas
    forceHexColors(pdfContent.value)

    // Génération PDF
    html2pdf()
      .set({
        margin: 10,
        filename: `RAPPORT_${dept.value.name}.pdf`,
        image: { type: 'png', quality: 1 },
        html2canvas: { scale: 2, useCORS: true, backgroundColor: '#ffffff' },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      })
      .from(pdfContent.value)
      .save()
      .finally(() => {
        // remettre print-only hidden
        printSections.forEach(el => el.classList.add('hidden'))
        isExporting.value = false
      })
  } catch (err) {
    console.error("Erreur PDF:", err)
    isExporting.value = false
  }
}

onMounted(() => loadDepartement())
</script>

<template>
  <div class="flex-1 lg:ml-64 bg-[#F8FAFC] min-h-screen p-6 lg:p-10">
    
    <div v-if="loading" class="h-[70vh] flex flex-col items-center justify-center">
      <div class="w-10 h-10 border-4 border-emerald-500/20 border-t-emerald-600 rounded-full animate-spin mb-4"></div>
      <p class="text-xs font-bold text-slate-400 uppercase tracking-widest">Accès aux archives...</p>
    </div>

    <div v-else-if="dept" class="max-w-7xl mx-auto space-y-10 animate-fade-in">
      
      <header data-html2canvas-ignore class="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-200 pb-8">
        <div>
          <button @click="router.back()" class="group flex items-center gap-2 text-slate-400 hover:text-emerald-600 transition-colors mb-6 text-[10px] font-black uppercase tracking-[0.2em]">
            <ChevronLeft class="w-4 h-4 transition-transform group-hover:-translate-x-1" /> Retour au Dashboard
          </button>
          <div class="flex items-center gap-5">
            <div class="p-4 bg-white rounded-2xl shadow-sm border border-slate-100 text-emerald-600">
              <Building2 class="w-8 h-8" />
            </div>
            <div>
              <h1 class="text-4xl font-black text-slate-900 leading-none tracking-tight">{{ dept.name }}</h1>
              <p class="text-slate-500 mt-2 font-medium flex items-center gap-2">
                <ShieldCheck class="w-4 h-4 text-emerald-500" /> Unité certifiée en exploitation active
              </p>
            </div>
          </div>
        </div>

        <div class="flex gap-4">
          <button @click="exportToPDF" :disabled="isExporting"
            class="px-8 py-4 bg-white border border-slate-200 text-slate-700 rounded-2xl font-bold text-sm shadow-sm hover:shadow-md transition-all flex items-center gap-3 active:scale-95 disabled:opacity-50">
            <Download v-if="!isExporting" class="w-4 h-4 text-emerald-600" />
            <span v-else class="w-4 h-4 border-2 border-slate-200 border-t-emerald-500 rounded-full animate-spin"></span>
            {{ isExporting ? 'Génération...' : 'Exporter le rapport' }}
          </button>
          <button class="px-8 py-4 bg-[#1e293b] text-white rounded-2xl font-bold text-sm shadow-xl hover:bg-black transition-all active:scale-95">
            Modifier l'unité
          </button>
        </div>
      </header>

      <div ref="pdfContent" class="space-y-10 p-2 bg-[#F8FAFC] rounded-3xl">
        
        <div class="print-only hidden justify-between items-center border-b-4 border-[#10B981] pb-10 mb-10">
          <div>
            <h2 class="text-3xl font-black text-[#0F172A]">RAPPORT TECHNIQUE D'UNITÉ</h2>
            <p class="text-[#64748B] font-bold text-xs uppercase tracking-[0.3em] mt-2">Dossier ID: {{ departementId }}</p>
          </div>
          <div class="text-right">
            <p class="text-[#10B981] font-black text-2xl tracking-tighter">AGRO-INSIGHTS</p>
            <p class="text-[9px] text-[#94A3B8] font-bold uppercase tracking-widest">Extraction du {{ new Date().toLocaleDateString() }}</p>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div class="lg:col-span-2 space-y-8">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div v-for="stat in [
                { label: 'Personnel', value: dept.agents, icon: Users, color: '#2563EB', bg: '#EFF6FF' },
                { label: 'Cheptel', value: dept.animals, icon: Beef, color: '#10B981', bg: '#ECFDF5' },
                { label: 'Campagnes', value: dept.campagnes, icon: TrendingUp, color: '#7C3AED', bg: '#F5F3FF' }
              ]" :key="stat.label" class="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
                <div :style="{ backgroundColor: stat.bg, color: stat.color }" class="w-12 h-12 rounded-2xl flex items-center justify-center mb-6">
                  <component :is="stat.icon" class="w-6 h-6" />
                </div>
                <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{{ stat.label }}</p>
                <p class="text-3xl font-black text-slate-900">{{ stat.value }}</p>
              </div>
            </div>

            <div class="bg-[#0F172A] rounded-[3rem] p-12 text-white relative overflow-hidden shadow-2xl">
              <div class="relative z-10 flex flex-col md:flex-row justify-between items-center gap-12">
                <div>
                  <p class="text-[#10B981] text-[11px] font-black uppercase tracking-[0.4em] mb-4">Revenus Cumulés</p>
                  <h2 class="text-6xl font-black tracking-tight">{{ formatMoney(dept.revenus) }}</h2>
                  <p class="text-slate-400 mt-4 text-sm font-medium">Bilan financier de l'unité en temps réel</p>
                </div>
                <div class="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 backdrop-blur-xl min-w-[280px]">
                  <div class="flex justify-between items-center mb-4">
                    <span class="text-xs font-bold text-slate-400 uppercase tracking-widest">Efficacité</span>
                    <span class="text-[#10B981] font-black">{{ dept.perf }}</span>
                  </div>
                  <div class="w-full bg-white/10 h-3 rounded-full overflow-hidden">
                    <div class="bg-[#10B981] h-full rounded-full" :style="{ width: dept.perf }"></div>
                  </div>
                </div>
              </div>
              <div class="absolute -right-20 -bottom-20 w-80 h-80 bg-[#10B981]/10 blur-[100px] rounded-full"></div>
            </div>
          </div>

          <div class="lg:col-span-1">
            <div class="bg-white rounded-[3rem] border border-slate-100 shadow-sm p-10 h-full">
              <h3 class="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-10 pb-6 border-b border-slate-50">Gestion de l'unité</h3>
              
              <div class="flex flex-col items-center text-center space-y-6 mb-12">
                <div class="w-28 h-28 bg-[#F8FAFC] rounded-[2.5rem] flex items-center justify-center text-slate-300 border-4 border-white shadow-xl">
                  <UserCircle class="w-16 h-16" />
                </div>
                <div>
                  <h4 class="text-2xl font-black text-slate-900">{{ dept.chef }}</h4>
                  <p class="text-emerald-600 font-bold text-[10px] uppercase tracking-wider mt-2 bg-emerald-50 px-4 py-1.5 rounded-full inline-block">Chef de Département</p>
                </div>
              </div>

              <div class="space-y-5">
                <div class="group flex items-center gap-4 p-5 bg-[#F8FAFC] rounded-2xl transition-all border border-transparent hover:border-emerald-100">
                  <div class="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-slate-400 group-hover:text-emerald-500 transition-colors">
                    <Mail class="w-4 h-4" />
                  </div>
                  <p class="text-sm font-bold text-slate-600 truncate">{{ dept.email }}</p>
                </div>
                <div class="group flex items-center gap-4 p-5 bg-[#F8FAFC] rounded-2xl transition-all border border-transparent hover:border-emerald-100">
                  <div class="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-slate-400 group-hover:text-emerald-500 transition-colors">
                    <Phone class="w-4 h-4" />
                  </div>
                  <p class="text-sm font-bold text-slate-600">{{ dept.phone }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="print-only hidden border-t-2 border-[#E2E8F0] mt-20 pt-10 flex justify-between items-end">
          <div class="text-[10px] text-[#94A3B8] font-bold uppercase leading-loose">
            Validation Système<br/>
            Ref Log: {{ departementId.substring(0,8) }}<br/>
            Agro-Insights Cloud ERP
          </div>
          <div class="text-center">
            <div class="w-56 h-[2px] bg-[#0F172A] mb-4 mx-auto"></div>
            <p class="text-xs font-black text-[#0F172A] uppercase tracking-[0.2em]">Signature de la Direction</p>
            <p class="text-[9px] text-[#94A3B8] mt-1 font-medium">Document certifié conforme aux registres numériques</p>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<style scoped>
.animate-fade-in { 
  animation: fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1); 
}

@keyframes fadeIn { 
  from { opacity: 0; transform: translateY(30px); } 
  to { opacity: 1; transform: translateY(0); } 
}

/* On évite les filtres et ombres complexes sur le PDF pour éviter le flou */
@media print {
  * { -webkit-print-color-adjust: exact !important; }
}

/* Couleurs forçées en HEX pour html2canvas */
/* Exemple pour html2canvas */
:deep(.text-emerald-600) { color: #059669 !important; }
:deep(.bg-emerald-50) { background-color: #ECFDF5 !important; }
:deep(.bg-slate-900) { background-color: #0F172A !important; }
</style>