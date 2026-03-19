<script setup>
import { ref, computed } from 'vue'
import {
  Users,
  CheckCircle2,
  Medal,
  TrendingUp,
  Search,
  Plus,
  Mail,
  Phone,
  Edit2,
  Trash2,
} from 'lucide-vue-next'

// Statistiques du haut
const stats = [
  { title: 'Total Agents', value: '8', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
  {
    title: 'Agents Actifs',
    value: '8',
    icon: CheckCircle2,
    color: 'text-emerald-500',
    bg: 'bg-emerald-50',
  },
  {
    title: 'Tâches Complétées',
    value: '1100',
    icon: Medal,
    color: 'text-orange-500',
    bg: 'bg-orange-50',
  },
  {
    title: 'Performance Moy.',
    value: '86.4%',
    icon: TrendingUp,
    color: 'text-purple-500',
    bg: 'bg-purple-50',
  },
]

// Données des agents
const agents = ref([
  {
    id: 1,
    nom: 'Paul Lefebvre',
    date: 'mai 2022',
    email: 'paul.lefebvre@elevage.com',
    tel: '+221 76 111 22 33',
    dept: 'Volaille',
    role: 'Agent terrain',
    taches: 145,
    perf: 'Très Bon',
    statut: 'Actif',
  },
  {
    id: 2,
    nom: 'Claire Moreau',
    date: 'mars 2022',
    email: 'claire.moreau@elevage.com',
    tel: '+221 76 222 33 44',
    dept: 'Volaille',
    role: 'Agent santé',
    taches: 132,
    perf: 'Excellent',
    statut: 'Actif',
  },
  {
    id: 3,
    nom: 'Luc Petit',
    date: 'déc. 2021',
    email: 'luc.petit@elevage.com',
    tel: '+221 76 333 44 55',
    dept: 'Bovins',
    role: 'Agent terrain',
    taches: 189,
    perf: 'Très Bon',
    statut: 'Actif',
  },
  {
    id: 4,
    nom: 'Emma Rousseau',
    date: 'juil. 2022',
    email: 'emma.rousseau@elevage.com',
    tel: '+221 76 444 55 66',
    dept: 'Bovins',
    role: 'Agent nutrition',
    taches: 98,
    perf: 'Très Bon',
    statut: 'Actif',
  },
])

// Helper pour les couleurs de performance
const getPerfClass = (perf) => {
  if (perf === 'Excellent') return 'bg-emerald-500 text-white'
  if (perf === 'Très Bon') return 'bg-blue-500 text-white'
  return 'bg-slate-500 text-white'
}
</script>
<template>
  <main class="flex-1 lg:ml-64 p-4 lg:p-8 transition-all duration-300 w-full">
    <div class="flex justify-between items-start mb-8">
      <div>
        <h1 class="text-2xl font-bold text-slate-900">Agents</h1>
        <p class="text-slate-500 text-sm">Gestion de tous les agents terrain</p>
      </div>
      <button
        class="bg-slate-950 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium"
      >
        <Plus class="w-4 h-4" /> Ajouter un Agent
      </button>
    </div>

    <div class="grid grid-cols-4 gap-6 mb-8">
      <div
        v-for="stat in stats"
        :key="stat.title"
        class="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm"
      >
        <div class="flex justify-between items-start mb-4">
          <span class="text-sm font-medium text-slate-500">{{ stat.title }}</span>
          <div :class="[stat.bg, stat.color, 'p-2 rounded-lg']">
            <component :is="stat.icon" class="w-5 h-5" />
          </div>
        </div>
        <div class="text-2xl font-bold text-slate-900">{{ stat.value }}</div>
      </div>
    </div>

    <div class="flex gap-4 mb-6">
      <div class="relative flex-1">
        <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Rechercher par nom ou email..."
          class="w-full pl-10 pr-4 py-2.5 bg-slate-100 border-none rounded-xl text-sm focus:ring-2 focus:ring-slate-200 outline-none"
        />
      </div>
      <select
        class="bg-slate-100 border-none rounded-xl px-4 py-2.5 text-sm text-slate-600 outline-none min-w-[200px]"
      >
        <option>Tous les départements</option>
      </select>
    </div>

    <div class="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <div class="p-6 border-b border-slate-50">
        <h2 class="font-bold text-slate-800">Liste des Agents ({{ agents.length }})</h2>
      </div>

      <table class="w-full text-left border-collapse">
        <thead>
          <tr class="text-slate-400 text-xs uppercase tracking-wider border-b border-slate-50">
            <th class="px-6 py-4 font-semibold">Agent</th>
            <th class="px-6 py-4 font-semibold">Contact</th>
            <th class="px-6 py-4 font-semibold">Département</th>
            <th class="px-6 py-4 font-semibold">Rôle</th>
            <th class="px-6 py-4 font-semibold text-center">Tâches</th>
            <th class="px-6 py-4 font-semibold text-center">Performance</th>
            <th class="px-6 py-4 font-semibold text-center">Statut</th>
            <th class="px-6 py-4 font-semibold text-right">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-50">
          <tr
            v-for="agent in agents"
            :key="agent.id"
            class="hover:bg-slate-50/50 transition-colors"
          >
            <td class="px-6 py-4">
              <div class="font-bold text-slate-900">{{ agent.nom }}</div>
              <div class="text-xs text-slate-400">Depuis {{ agent.date }}</div>
            </td>
            <td class="px-6 py-4">
              <div class="flex items-center gap-2 text-xs text-slate-500 mb-1">
                <Mail class="w-3.5 h-3.5 text-slate-300" /> {{ agent.email }}
              </div>
              <div class="flex items-center gap-2 text-xs text-slate-500">
                <Phone class="w-3.5 h-3.5 text-slate-300" /> {{ agent.tel }}
              </div>
            </td>
            <td class="px-6 py-4">
              <span
                class="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-[11px] font-bold border border-slate-200"
              >
                {{ agent.dept }}
              </span>
            </td>
            <td class="px-6 py-4 text-sm text-slate-500">{{ agent.role }}</td>
            <td class="px-6 py-4 text-center font-bold text-slate-700">{{ agent.taches }}</td>
            <td class="px-6 py-4 text-center">
              <span
                :class="[
                  getPerfClass(agent.perf),
                  'px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tighter',
                ]"
              >
                {{ agent.perf }}
              </span>
            </td>
            <td class="px-6 py-4 text-center">
              <span
                class="bg-emerald-500 text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase"
              >
                {{ agent.statut }}
              </span>
            </td>
            <td class="px-6 py-4 text-right">
              <div class="flex justify-end gap-2">
                <button
                  class="p-1.5 border border-slate-200 rounded-lg hover:bg-slate-100 text-slate-500"
                >
                  <Edit2 class="w-4 h-4" />
                </button>
                <button
                  class="p-1.5 border border-rose-100 rounded-lg hover:bg-rose-50 text-rose-500"
                >
                  <Trash2 class="w-4 h-4" />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
</main>
</template>
