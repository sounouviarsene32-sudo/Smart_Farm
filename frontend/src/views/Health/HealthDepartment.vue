<script setup>
import {
  CheckCircle2,
  Heart,
  ShieldAlert,
  AlertCircle,
  Syringe,
  CalendarPlus,
  UserCircle,
} from 'lucide-vue-next'

import { useLoginStore } from '@/stores/login.store'
const loginStore = useLoginStore()
// const currentUser = loginStore.getDecodedToken
const currentUser = { name: 'Théodore', role: 'admin' }
// Plus tard pour simuler l'agent :
currentUser.role = 'agent'
// console.log('Current User:', currentUser ?? 'No user data available')

const healthStats = [
  { label: 'En Bonne Santé', value: '1198', icon: CheckCircle2, color: 'text-emerald-500' },
  { label: 'En Traitement', value: '32', icon: Heart, color: 'text-blue-500' },
  { label: 'En Quarantaine', value: '10', icon: ShieldAlert, color: 'text-orange-500' },
  { label: 'État Critique', value: '2', icon: AlertCircle, color: 'text-rose-500' },
]

const vaccinations = [
  {
    id: 1,
    disease: 'Newcastle',
    status: 'À venir',
    dept: 'Volaille',
    animalCount: 450,
    date: '25 mars 2026',
    daysRemaining: 4,
    bgIcon: 'bg-orange-50',
    colorIcon: 'text-orange-500',
    badgeClass: 'bg-orange-500 text-white',
  },
  {
    id: 2,
    disease: 'Fièvre aphteuse',
    status: 'À venir',
    dept: 'Bovins',
    animalCount: 320,
    date: '28 mars 2026',
    daysRemaining: 7,
    bgIcon: 'bg-orange-50',
    colorIcon: 'text-orange-500',
    badgeClass: 'bg-orange-500 text-white',
  },
  {
    id: 3,
    disease: 'PPR',
    status: 'Planifié',
    dept: 'Caprins',
    animalCount: 280,
    date: '5 avril 2026',
    daysRemaining: 15,
    bgIcon: 'bg-blue-50',
    colorIcon: 'text-blue-500',
    badgeClass: 'bg-blue-600 text-white',
  },
  {
    id: 4,
    disease: 'Gumboro',
    status: 'Urgent',
    dept: 'Volaille',
    animalCount: 450,
    date: '22 mars 2026',
    daysRemaining: 1,
    bgIcon: 'bg-rose-50',
    colorIcon: 'text-rose-500',
    badgeClass: 'bg-rose-500 text-white',
  },
]

const recentTreatments = [
  {
    id: 1,
    date: '18 mars 2026',
    dept: 'Volaille',
    type: 'Antiparasitaire',
    count: 50,
    vet: 'Dr. Sow',
    status: 'Complété',
  },
  {
    id: 2,
    date: '17 mars 2026',
    dept: 'Bovins',
    type: 'Antibiotique',
    count: 12,
    vet: 'Dr. Diop',
    status: 'Complété',
  },
  {
    id: 3,
    date: '16 mars 2026',
    dept: 'Caprins',
    type: 'Anti-inflammatoire',
    count: 8,
    vet: 'Dr. Sow',
    status: 'Complété',
  },
  {
    id: 4,
    date: '15 mars 2026',
    dept: 'Ovins',
    type: 'Désinfection',
    count: 200,
    vet: 'Dr. Ndiaye',
    status: 'Complété',
  },
]
</script>

<template>
  <main
    class="flex-1 lg:ml-64 p-4 lg:p-8 transition-all duration-300 w-full bg-red-50 min-h-screen space-y-8"
  >
    <header class="flex justify-between items-start">
      <div>
        <h1 class="text-2xl font-bold text-slate-900">Santé des Animaux</h1>
        <p class="text-slate-500 text-sm">Suivi sanitaire et vaccinations</p>
      </div>
    </header>

    <div class="grid my-10 grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div
        v-for="stat in healthStats"
        :key="stat.label"
        class="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex justify-between items-center"
      >
        <div>
          <p class="text-xs font-medium text-slate-400 mb-1">{{ stat.label }}</p>
          <p class="text-2xl font-bold text-slate-900">{{ stat.value }}</p>
        </div>
        <component :is="stat.icon" :class="['w-8 h-8', stat.color]" />
      </div>
    </div>

    <div class="bg-white my-10 rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <div class="p-6 border-b border-slate-50 flex justify-between items-center">
        <h2 class="font-bold text-slate-800">Planning de Vaccination</h2>
        <button v-if="currentUser.role == 'chef'"
          class="bg-slate-950 text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2"
        >
          <CalendarPlus class="w-4 h-4" /> Planifier
        </button>
      </div>
      <div class="divide-y divide-slate-50">
        <div
          v-for="vax in vaccinations"
          :key="vax.id"
          class="p-6 flex items-center justify-between hover:bg-slate-50/50 transition-colors"
        >
          <div class="flex items-center gap-4">
            <div :class="['p-3 rounded-full', vax.bgIcon]">
              <Syringe :class="['w-5 h-5', vax.colorIcon]" />
            </div>
            <div>
              <div class="flex items-center gap-2">
                <span class="font-bold text-slate-900">{{ vax.disease }}</span>
                <span
                  :class="['text-[10px] px-2 py-0.5 rounded font-bold uppercase', vax.badgeClass]"
                >
                  {{ vax.status }}
                </span>
              </div>
              <p class="text-xs text-slate-400">{{ vax.dept }} • {{ vax.animalCount }} animaux</p>
            </div>
          </div>
          <div class="text-right text-sm">
            <div class="font-bold text-slate-900">{{ vax.date }}</div>
            <div class="text-xs text-slate-400">Dans {{ vax.daysRemaining }} jours</div>
          </div>
        </div>
      </div>
    </div>

    <div class="bg-white my-10 rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <div class="p-6 border-b border-slate-50">
        <h2 class="font-bold text-slate-800">Traitements Récents</h2>
      </div>
      <table class="w-full text-left text-sm">
        <thead class="bg-slate-50/50 text-slate-400 font-semibold text-xs uppercase tracking-wider">
          <tr>
            <th class="px-6 py-4 font-semibold">Date</th>
            <th class="px-6 py-4 font-semibold">Département</th>
            <th class="px-6 py-4 font-semibold">Type de Traitement</th>
            <th class="px-6 py-4 font-semibold text-center">Animaux</th>
            <th class="px-6 py-4 font-semibold">Vétérinaire</th>
            <th class="px-6 py-4 text-center">Statut</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-50">
          <tr v-for="t in recentTreatments" :key="t.id" class="text-slate-600">
            <td class="px-6 py-4">{{ t.date }}</td>
            <td class="px-6 py-4">
              <span class="bg-slate-100 px-2.5 py-1 rounded text-[11px] font-bold text-slate-600">{{
                t.dept
              }}</span>
            </td>
            <td class="px-6 py-4">
              <div class="flex items-center gap-2">
                <Heart class="w-4 h-4 text-blue-500" /> {{ t.type }}
              </div>
            </td>
            <td class="px-6 py-4 text-center font-bold text-slate-900">{{ t.count }} animaux</td>
            <td class="px-6 py-4 flex items-center gap-2">
              <UserCircle class="w-5 h-5 text-slate-300" /> {{ t.vet }}
            </td>
            <td class="px-6 py-4">
              <div class="flex justify-center">
                <span
                  class="bg-emerald-500 text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase"
                >
                  {{ t.status }}
                </span>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="bg-rose-50 my-10 border border-rose-100 p-5 rounded-2xl flex gap-4 items-start">
      <div class="bg-white p-2 rounded-full border border-rose-200">
        <AlertCircle class="text-rose-500 w-6 h-6" />
      </div>
      <div>
        <h4 class="text-rose-900 font-bold text-sm uppercase tracking-wide">Alerte Santé</h4>
        <p class="text-rose-700 text-sm mt-1">
          2 animaux en état critique nécessitent une attention immédiate. Veuillez contacter le
          vétérinaire.
        </p>
      </div>
    </div>
  </main>
</template>

<style scoped></style>
