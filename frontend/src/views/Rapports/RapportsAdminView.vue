<script setup>
import { computed, ref } from 'vue'
import {
  FileBarChart,
  FileText,
  CheckCircle,
  Check,
  XCircle,
  Info,
  Key,
  UserCircle,
} from 'lucide-vue-next'


import { 
  Download, QrCode, Search, ScanQrCode, Beef,
  Users, DollarSign, Activity, TrendingUp, TrendingDown, Package,
 CalendarClock, Target, Syringe, Heart, Factory
} from 'lucide-vue-next';

// Données des rapports en attente de validation
const reportsToValidate = ref([
  {
    id: 1,
    title: 'Bilan Hebdomadaire - Production Œufs',
    author: 'Jean Dupont',
    dept: 'Volaille',
    date: 'Hier, 16:45',
  },
  {
    id: 2,
    title: 'Rapport Sanitaire Mensuel',
    author: 'Dr. Sow',
    dept: 'Santé & Vétérinaire',
    date: "Aujourd'hui, 09:12",
  },
  {
    id: 3,
    title: 'Inventaire Aliments Stock B',
    author: 'Paul Lefebvre',
    dept: 'Stock',
    date: '19/03/2026',
  },
])

// Données des demandes de permissions (de la part des agents/chefs)
const permissionRequests = ref([
  {
    id: 1,
    user: 'Marie Martin',
    initials: 'MM',
    role: 'Chef Département Bovins',
    module: 'Finances',
  },
  {
    id: 2,
    user: 'Pierre Durand',
    initials: 'PD',
    role: 'Agent de Terrain',
    module: 'Inventaire Avancé',
  },
])

const validate = (id, action) => {
  // Logique pour traiter le rapport (Approuver ou Rejeter)
  reportsToValidate.value = reportsToValidate.value.filter((r) => r.id !== id)
}

import { ExternalLink } from 'lucide-vue-next' // Ajoute ces imports

const searchHistory = ref('')
const filterStatus = ref('all')

const reportHistory = ref([
  {
    id: 101,
    title: 'Inventaire Mensuel - Mars',
    dept: 'Stock',
    author: 'Paul Lefebvre',
    date: '20/03/2026',
    status: 'Validé',
  },
  {
    id: 102,
    title: 'Consommation Alimentaire Hebdo',
    dept: 'Bovins',
    author: 'Marie Martin',
    date: '19/03/2026',
    status: 'Rejeté',
  },
  {
    id: 103,
    title: 'Rapport Sanitaire Q1',
    dept: 'Santé',
    author: 'Dr. Sow',
    date: '18/03/2026',
    status: 'Validé',
  },
  {
    id: 104,
    title: 'Ventes Poulets de chair',
    dept: 'Finance',
    author: 'Jean Dupont',
    date: '17/03/2026',
    status: 'En attente',
  },
])

// Logique de filtrage
const filteredHistory = computed(() => {
  return reportHistory.value.filter((report) => {
    const matchesSearch = report.title.toLowerCase().includes(searchHistory.value.toLowerCase())
    const matchesStatus = filterStatus.value === 'all' || report.status === filterStatus.value
    return matchesSearch && matchesStatus
  })
})

// Helpers de style
const getStatusClass = (status) => {
  if (status === 'Validé') return 'bg-emerald-500 text-white'
  if (status === 'Rejeté') return 'bg-rose-500 text-white'
  return 'bg-orange-500 text-white'
}

const getStatusBg = (status) => {
  if (status === 'Validé') return 'bg-emerald-50 text-emerald-600'
  if (status === 'Rejeté') return 'bg-rose-50 text-rose-600'
  return 'bg-orange-50 text-orange-600'
}

// --- Données Rapports Prédéfinis (reproduites fidèlement) ---
const predefinedReports = [
  { title: 'Rapport Mensuel', description: 'Vue d’ensemble du mois en cours', icon: FileText, colorIcon: 'text-blue-600', bgIcon: 'bg-blue-50' },
  { title: 'Rapport Trimestriel', description: 'Analyse des 3 derniers mois', icon: CalendarClock, colorIcon: 'text-emerald-500', bgIcon: 'bg-emerald-50' },
  { title: 'Rapport Annuel', description: 'Bilan complet de l’année', icon: Target, colorIcon: 'text-purple-500', bgIcon: 'bg-purple-50' },
  { title: 'Rapport Financier', description: 'Détails revenus et dépenses', icon: DollarSign, colorIcon: 'text-orange-500', bgIcon: 'bg-orange-100' },
  { title: 'Rapport Sanitaire', description: 'État de santé du cheptel', icon: Heart, colorIcon: 'text-rose-500', bgIcon: 'bg-rose-50' },
  { title: 'Rapport Production', description: 'Performances par département', icon: Factory, colorIcon: 'text-orange-500', bgIcon: 'bg-white border border-slate-100' },
];
</script>

<template>
  <main
    class="flex-1 lg:ml-64 p-4 lg:p-8 transition-all duration-300 w-full bg-red-50 min-h-screen space-y-8"
  >
    <header>
      <div>
        <h1 class="text-3xl font-bold text-slate-900">Rapports & Activités</h1>
        <p class="text-slate-500 text-sm">Suivi des performances et validations</p>
      </div>
    </header>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div class="lg:col-span-2 space-y-6">
        <div class="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div class="p-6 border-b border-slate-50 flex justify-between items-center">
            <h2 class="font-bold text-slate-800 flex items-center gap-2">
              <CheckCircle class="w-5 h-5 text-emerald-500" /> Flux de Validation
            </h2>
            <span
              class="text-[10px] font-bold bg-orange-100 text-orange-600 px-2 py-1 rounded-lg uppercase"
            >
              3 En attente
            </span>
          </div>

          <div class="divide-y divide-slate-50">
            <div
              v-for="report in reportsToValidate"
              :key="report.id"
              class="p-6 hover:bg-slate-50/50 transition-colors"
            >
              <div class="flex justify-between items-start mb-4">
                <div class="flex gap-4">
                  <div class="p-3 bg-slate-100 rounded-2xl text-slate-600">
                    <FileText class="w-6 h-6" />
                  </div>
                  <div>
                    <h3 class="font-bold text-slate-900 text-sm">{{ report.title }}</h3>
                    <p class="text-xs text-slate-400">
                      Soumis par
                      <span class="text-slate-600 font-semibold">{{ report.author }}</span> •
                      {{ report.dept }}
                    </p>
                  </div>
                </div>
                <div class="text-right">
                  <span class="text-[10px] text-slate-400 font-bold uppercase block mb-1">{{
                    report.date
                  }}</span>
                  <span
                    class="bg-orange-500 text-white text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-tighter"
                    >En attente</span
                  >
                </div>
              </div>

              <div class="flex items-center justify-between mt-6 bg-slate-50 p-3 rounded-2xl">
                <p class="text-[11px] text-slate-500 italic flex items-center gap-2">
                  <Info class="w-3 h-3" /> Cliquez pour prévisualiser le document avant validation
                </p>
                <div class="flex gap-2">
                  <button
                    @click="validate(report.id, 'reject')"
                    class="p-2 bg-white border border-rose-100 text-rose-500 rounded-lg hover:bg-rose-50 transition-colors"
                  >
                    <XCircle class="w-4 h-4" />
                  </button>
                  <button
                    @click="validate(report.id, 'approve')"
                    class="px-4 py-2 bg-emerald-500 text-white text-xs font-bold rounded-lg hover:bg-emerald-600 flex items-center gap-2 shadow-sm shadow-emerald-100"
                  >
                    <Check class="w-4 h-4" /> Valider le rapport
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="space-y-6">
        <div class="bg-slate-900 rounded-lg p-6 text-white shadow-xl shadow-slate-200">
          <h2
            class="font-bold mb-6 flex items-center gap-2 text-sm uppercase tracking-wider opacity-90"
          >
            <Key class="w-4 h-4" /> Centre de Permissions
          </h2>

          <div class="space-y-4">
            <div
              v-for="req in permissionRequests"
              :key="req.id"
              class="bg-white/10 border border-white/10 rounded-2xl p-4 backdrop-blur-sm"
            >
              <div class="flex items-center gap-3 mb-3">
                <div
                  class="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center font-bold text-[10px]"
                >
                  {{ req.initials }}
                </div>
                <div>
                  <div class="text-xs font-bold">{{ req.user }}</div>
                  <div class="text-[9px] text-white/50">{{ req.role }}</div>
                </div>
              </div>
              <p class="text-[11px] text-white/80 leading-relaxed mb-4">
                Demande l'accès au
                <span class="text-blue-400 font-bold underline">Module {{ req.module }}</span> pour
                la période de mars.
              </p>
              <div class="grid grid-cols-2 gap-2">
                <button
                  class="py-2 bg-white/5 hover:bg-white/10 rounded-xl text-[10px] font-bold transition-colors"
                >
                  Décliner
                </button>
                <button
                  class="py-2 bg-blue-500 hover:bg-blue-400 rounded-xl text-[10px] font-bold transition-colors"
                >
                  Accorder
                </button>
              </div>
            </div>
          </div>

          <button
            class="w-full mt-6 py-3 border border-white/20 rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-white/5 transition-colors"
          >
            Voir toutes les demandes
          </button>
        </div>
      </div>
    </div>

    <section>
      <h2 class="text-xl font-bold text-slate-800 mb-6">Rapports Prédéfinis</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="report in predefinedReports" :key="report.title" class="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between hover:border-slate-200 transition-colors">
          <div class="flex items-center gap-4">
            <div :class="['p-3 rounded-2xl', report.bgIcon]">
              <component :is="report.icon" :class="['w-6 h-6', report.colorIcon]" />
            </div>
            <div>
              <h3 class="font-bold text-slate-950 text-sm">{{ report.title }}</h3>
              <p class="text-xs text-slate-400 mt-1">{{ report.description }}</p>
            </div>
          </div>
          <button class="text-slate-400 hover:text-slate-900 transition-colors">
            <Download class="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>

    <div class="bg-white shadow-sm overflow-hidden mt-8">
      <div
        class="p-6 border-b border-slate-50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
      >
        <div>
          <h2 class="font-bold text-slate-800 text-lg">Surveillance Globale</h2>
          <p class="text-xs text-slate-400">Historique complet de tous les rapports générés</p>
        </div>

        <div class="flex items-center gap-3 w-full md:w-auto">
          <div class="relative flex-1 md:w-64">
            <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              v-model="searchHistory"
              type="text"
              placeholder="Rechercher un rapport..."
              class="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-slate-200"
            />
          </div>
          <select
            v-model="filterStatus"
            class="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-600 outline-none"
          >
            <option value="all">Tous les statuts</option>
            <option value="Validé">Validés</option>
            <option value="En attente">En attente</option>
            <option value="Rejeté">Rejetés</option>
          </select>
        </div>
      </div>

      <table class="w-full text-left text-sm">
        <thead
          class="bg-slate-50/50 text-slate-400 text-[10px] font-bold uppercase tracking-widest border-b border-slate-50"
        >
          <tr>
            <th class="px-6 py-4">Rapport</th>
            <th class="px-6 py-4">Département</th>
            <th class="px-6 py-4">Auteur</th>
            <th class="px-6 py-4">Date de soumission</th>
            <th class="px-6 py-4">Statut</th>
            <th class="px-6 py-4 text-right">Action</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-50">
          <tr
            v-for="report in filteredHistory"
            :key="report.id"
            class="hover:bg-slate-50/30 transition-colors"
          >
            <td class="px-6 py-4">
              <div class="flex items-center gap-3">
                <div :class="['p-2 rounded-lg', getStatusBg(report.status)]">
                  <FileText class="w-4 h-4" />
                </div>
                <span class="font-bold text-slate-800 text-xs">{{ report.title }}</span>
              </div>
            </td>
            <td class="px-6 py-4">
              <span class="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-1 rounded">
                {{ report.dept }}
              </span>
            </td>
            <td class="px-6 py-4 text-xs text-slate-600 font-medium">{{ report.author }}</td>
            <td class="px-6 py-4 text-xs text-slate-400">{{ report.date }}</td>
            <td class="px-6 py-4">
              <span
                :class="[
                  getStatusClass(report.status),
                  'text-[9px] px-2.5 py-1 rounded-full font-extrabold uppercase tracking-tighter',
                ]"
              >
                {{ report.status }}
              </span>
            </td>
            <td class="px-6 py-4 text-right">
              <button class="text-slate-400 hover:text-slate-900 transition-colors">
                <ExternalLink class="w-4 h-4" />
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <div class="p-4 bg-slate-50/50 border-t border-slate-50 flex justify-center">
        <button
          class="text-[10px] font-bold text-slate-400 hover:text-slate-600 uppercase tracking-widest"
        >
          Charger plus de rapports
        </button>
      </div>
    </div>
  </main>
</template>
