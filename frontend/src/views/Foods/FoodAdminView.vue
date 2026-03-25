<script setup>
import { Utensils, TrendingUp, Box, Award } from 'lucide-vue-next'

import { AlertTriangle } from 'lucide-vue-next'

const inventory = [
  {
    name: 'Aliment Volaille',
    qty: '2500 kg',
    min: '1000 kg',
    status: 'Normal',
    color: 'bg-emerald-500',
  },
  {
    name: 'Aliment Bovins',
    qty: '1800 kg',
    min: '2000 kg',
    status: 'Faible',
    color: 'bg-orange-500',
  },
]

const stats = [
  {
    label: 'Consommation/Mois',
    value: '9,500 kg',
    icon: Utensils,
    color: 'text-emerald-500',
    bg: 'bg-emerald-50',
  },
  {
    label: 'Taux Protéines',
    value: '18.5%',
    icon: TrendingUp,
    color: 'text-blue-500',
    bg: 'bg-blue-50',
  },
  {
    label: 'Valeur Énergétique',
    value: '2850 kcal',
    icon: Box,
    color: 'text-orange-500',
    bg: 'bg-orange-50',
  },
  {
    label: 'Certifications',
    value: '3',
    icon: Award,
    color: 'text-purple-500',
    bg: 'bg-purple-50',
  },
]

const rations = [
  { dept: 'Volaille', type: 'Starter/Grower/Finisher', parAnimal: '120 g', total: '54 kg' },
  { dept: 'Bovins', type: 'Concentré + Fourrage', parAnimal: '8 g', total: '2560 kg' },
  { dept: 'Caprins', type: 'Granulés + Fourrage', parAnimal: '1.5 g', total: '420 kg' },
  { dept: 'Ovins', type: 'Granulés + Fourrage', parAnimal: '1.2 g', total: '240 kg' },
]
</script>

<template>
  <main
    class="flex-1 lg:ml-64 lg:p-8 transition-all duration-300 w-full p-8 bg-slate-50 min-h-screen space-y-8"
  >
  <header>
      <div>
        <h1 class="text-3xl font-black text-slate-900 ">Gestionnaire alimentaire</h1>
      </div>
    </header>
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div
        v-for="stat in stats"
        :key="stat.label"
        class="bg-white p-6 rounded-xl border border-slate-100 shadow-sm"
      >
        <div class="flex justify-between items-start mb-4">
          <span class="text-sm font-medium text-slate-500">{{ stat.label }}</span>
          <div :class="['p-2 rounded-xl', stat.bg, stat.color]">
            <component :is="stat.icon" class="w-5 h-5" />
          </div>
        </div>
        <h3 class="text-2xl font-bold text-slate-900">{{ stat.value }}</h3>
      </div>
    </div>

    <div class="bg-white p-6 shadow-sm mb-8">
      <h2 class="text-lg font-bold text-slate-900 mb-6">Rations par Département</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div
          v-for="item in rations"
          :key="item.dept"
          class="p-5 rounded-2xl border border-slate-50 bg-slate-50/30"
        >
          <div class="flex justify-between items-center mb-4">
            <span class="font-bold text-slate-900">{{ item.dept }}</span>
            <span
              class="text-[10px] px-2 py-1 bg-white border border-slate-200 rounded-lg text-slate-500 uppercase font-bold tracking-tight"
            >
              {{ item.type }}
            </span>
          </div>
          <div class="space-y-2 text-sm">
            <div class="flex justify-between font-bold text-slate-600">
              <span>Campagnes:</span>
            </div>
            <div class="flex justify-between text-slate-500">
              <span>Animal mars</span>
              <span class="font-bold text-slate-900">{{ item.total }}</span>
            </div>
            <div class="flex justify-between text-slate-500">
              <span>Animal décembre</span>
              <span class="font-bold text-slate-900">{{ item.total }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="space-y-6">
      <div class="bg-orange-50 border border-orange-100 p-4 rounded-2xl flex items-center gap-4">
        <div class="p-2 bg-orange-100 text-orange-600 rounded-xl">
          <AlertTriangle class="w-5 h-5" />
        </div>
        <div class="flex-1">
          <p class="text-sm font-bold text-orange-900">Aliment Bovins</p>
          <p class="text-xs text-orange-700">Stock faible - Commande recommandée</p>
        </div>
        <button
          class="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl transition-all hover:bg-blue-500"
        >
          Commander
        </button>
      </div>

      <div class="bg-white shadow-sm overflow-hidden">
        <table class="w-full text-left text-sm">
          <thead class="bg-slate-50 text-slate-500 font-medium border-b border-slate-100">
            <tr>
              <th class="px-6 py-4">Article</th>
              <th class="px-6 py-4">Quantité</th>
              <th class="px-6 py-4">Statut</th>
              <th class="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-50">
            <tr
              v-for="item in inventory"
              :key="item.name"
              class="hover:bg-slate-50/50 transition-colors"
            >
              <td class="px-6 py-4 font-bold text-slate-900">{{ item.name }}</td>
              <td class="px-6 py-4 text-slate-600">{{ item.qty }}</td>
              <td class="px-6 py-4">
                <div class="flex items-center gap-2">
                  <span :class="['w-2 h-2 rounded-full', item.color]"></span>
                  <span class="text-xs font-semibold">{{ item.status }}</span>
                </div>
              </td>
              <td class="px-6 py-4 text-right">
                <button class="text-slate-400 hover:text-slate-900 font-bold text-xs uppercase">
                  Détails
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </main>
</template>
