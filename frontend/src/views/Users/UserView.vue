<script setup>
import { ref } from 'vue'
import {
  Users,
  ShieldCheck,
  UserCircle,
  UserCog,
  Search,
  Plus,
  Edit2,
  Lock,
  Trash2,
  Mail,
} from 'lucide-vue-next'

// Statistiques du haut
const stats = [
  { title: 'Total Utilisateurs', value: '7', icon: Users, color: 'text-blue-600' },
  { title: 'Administrateurs', value: '1', icon: ShieldCheck, color: 'text-purple-600' },
  { title: 'Chefs Département', value: '3', icon: UserCircle, color: 'text-blue-500' },
  { title: 'Agents', value: '3', icon: UserCog, color: 'text-emerald-500' },
]

// Données de la liste des utilisateurs
const users = ref([
  {
    id: 1,
    nom: 'Administrateur Système',
    username: '@admin',
    email: 'admin@elevage.com',
    role: 'Admin',
    dept: '-',
    lastLogin: '19/03/2026',
    statut: 'Actif',
  },
  {
    id: 2,
    nom: 'Jean Dupont',
    username: '@chef1',
    email: 'jean.dupont@elevage.com',
    role: 'Chef',
    dept: 'Volaille',
    lastLogin: '18/03/2026',
    statut: 'Actif',
  },
  {
    id: 3,
    nom: 'Marie Martin',
    username: '@chef2',
    email: 'marie.martin@elevage.com',
    role: 'Chef',
    dept: 'Bovins',
    lastLogin: '18/03/2026',
    statut: 'Actif',
  },
  {
    id: 4,
    nom: 'Pierre Durand',
    username: '@chef3',
    email: 'pierre.durand@elevage.com',
    role: 'Chef',
    dept: 'Caprins',
    lastLogin: '17/03/2026',
    statut: 'Actif',
  },
  {
    id: 5,
    nom: 'Paul Lefebvre',
    username: '@agent1',
    email: 'paul.lefebvre@elevage.com',
    role: 'Agent',
    dept: 'Volaille',
    lastLogin: '19/03/2026',
    statut: 'Actif',
  },
])

// Helpers pour les styles de badges
const getRoleClass = (role) => {
  if (role === 'Admin') return 'bg-purple-600 text-white'
  if (role === 'Chef') return 'bg-blue-600 text-white'
  return 'bg-emerald-500 text-white'
}

const getRoleIcon = (role) => {
  if (role === 'Admin') return ShieldCheck
  if (role === 'Chef') return UserCircle
  return UserCog
}
</script>

<template>
  <main  class="flex-1 lg:ml-64 p-4 lg:p-8 transition-all duration-300 w-full">
    <div class="flex justify-between items-start mb-8">
      <div>
        <h1 class="text-2xl font-bold text-slate-900">Utilisateurs</h1>
        <p class="text-slate-500 text-sm">Gestion des comptes et permissions</p>
      </div>
      <button
        class="bg-slate-950 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-semibold transition-hover hover:bg-slate-800"
      >
        <Plus class="w-4 h-4" /> Créer Utilisateur
      </button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div
        v-for="stat in stats"
        :key="stat.title"
        class="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm"
      >
        <div class="flex justify-between items-start">
          <div class="space-y-4">
            <span class="text-sm font-medium text-slate-400">{{ stat.title }}</span>
            <div class="text-2xl font-bold text-slate-900">{{ stat.value }}</div>
          </div>
          <component :is="stat.icon" :class="[stat.color, 'w-6 h-6']" stroke-width="1.5" />
        </div>
      </div>
    </div>

    <div class="flex gap-4 mb-6">
      <div class="relative flex-1">
        <Search class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Rechercher par nom ou username..."
          class="w-full pl-11 pr-4 py-2.5 bg-slate-100/50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-slate-200 transition-all"
        />
      </div>
      <select
        class="bg-slate-100/50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-600 outline-none min-w-[200px]"
      >
        <option>Tous les rôles</option>
      </select>
    </div>

    <div class="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <div class="p-6 border-b border-slate-50">
        <h2 class="font-bold text-slate-800">Liste des Utilisateurs ({{ users.length }})</h2>
      </div>

      <table class="w-full text-left">
        <thead>
          <tr
            class="text-slate-400 text-xs font-semibold uppercase tracking-wider border-b border-slate-50"
          >
            <th class="px-6 py-4">Utilisateur</th>
            <th class="px-6 py-4">Email</th>
            <th class="px-6 py-4 text-center">Rôle</th>
            <th class="px-6 py-4">Département</th>
            <th class="px-6 py-4">Dernière Connexion</th>
            <th class="px-6 py-4 text-center">Statut</th>
            <th class="px-6 py-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-50">
          <tr v-for="user in users" :key="user.id" class="hover:bg-slate-50/50 transition-colors">
            <td class="px-6 py-4">
              <div class="font-bold text-slate-900 text-sm">{{ user.nom }}</div>
              <div class="text-xs text-slate-400">{{ user.username }}</div>
            </td>
            <td class="px-6 py-4 text-sm text-slate-500">{{ user.email }}</td>
            <td class="px-6 py-4">
              <div class="flex justify-center">
                <span
                  :class="[
                    getRoleClass(user.role),
                    'px-3 py-1 rounded-full text-[10px] font-bold uppercase flex items-center gap-1.5',
                  ]"
                >
                  <component :is="getRoleIcon(user.role)" class="w-3 h-3" />
                  {{ user.role }}
                </span>
              </div>
            </td>
            <td class="px-6 py-4">
              <span
                v-if="user.dept !== '-'"
                class="px-3 py-1 bg-white border border-slate-200 text-slate-600 rounded-lg text-[11px] font-bold"
              >
                {{ user.dept }}
              </span>
              <span v-else class="text-slate-300">-</span>
            </td>
            <td class="px-6 py-4 text-sm text-slate-500">{{ user.lastLogin }}</td>
            <td class="px-6 py-4">
              <div class="flex justify-center">
                <span
                  class="bg-emerald-500 text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase"
                >
                  {{ user.statut }}
                </span>
              </div>
            </td>
            <td class="px-6 py-4">
              <div class="flex justify-end gap-2">
                <button
                  class="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-500 transition-colors"
                >
                  <Edit2 class="w-4 h-4" />
                </button>
                <button
                  class="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-500 transition-colors"
                >
                  <Lock class="w-4 h-4" />
                </button>
                <button
                  class="p-2 border border-rose-100 rounded-lg hover:bg-rose-50 text-rose-500 transition-colors"
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
