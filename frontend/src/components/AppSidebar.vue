<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useLoginStore } from '@/stores/login.store'
const loginStore = useLoginStore()
const currentUser = loginStore.getDecodedToken
console.log('Current User:', currentUser ?? 'No user data available')

import {
  LayoutDashboard,
  Users,
  UserCircle,
  DollarSign,
  Heart,
  Package,
  ShoppingCart,
  Building2,
  Target,
  Utensils,
  FileText,
  LogOut,
  Menu,
  X,
} from 'lucide-vue-next'

// router
const route = useRoute()
const router = useRouter()

// state
const sidebarOpen = ref(false)
const userName = "Nom d'utilisateur"
// currentUser.role = "admin" // Simuler un utilisateur connecté avec le rôle 

// navigation
let navigationItems = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Finance', href: '/admin/finance', icon: DollarSign },
  { name: 'Stock', href: '/admin/stock', icon: Package },
  { name: 'Vente', href: '/admin/vente', icon: ShoppingCart },
  { name: 'Santé', href: '/admin/sante', icon: Heart },
  { name: 'Campagne', href: '/admin/campagne', icon: Target },
  { name: 'Département', href: '/admin/departement', icon: Building2 },
  { name: 'Alimentation', href: '/admin/alimentation', icon: Utensils },
  { name: 'Agents', href: '/admin/agents', icon: UserCircle },
  { name: 'Chef Département', href: '/admin/chefs', icon: Users },
  { name: 'Utilisateurs', href: '/admin/users', icon: Users },
  { name: 'Rapport & Analyse', href: '/admin/rapports', icon: FileText },
]

if (currentUser && currentUser.role === 'chef') {
  navigationItems = [
    { name: 'Dashboard', href: '/chef', icon: LayoutDashboard },
    { name: 'Agents', href: '/chef/agents', icon: UserCircle },
    { name: 'Département', href: '/admin/departement', icon: Building2 },
    { name: 'Campagne', href: '/admin/campagne', icon: Target },
    { name: 'Stock', href: '/admin/stock', icon: Package },
    { name: 'Vente', href: '/admin/vente', icon: ShoppingCart },
    { name: 'Alimentation', href: '/admin/alimentation', icon: Utensils },
    { name: 'Santé', href: '/admin/sante', icon: Heart },
    { name: 'Rapports', href: '/chef/rapports', icon: FileText },
  ]
}
if (currentUser && currentUser.role === 'agent') {
  navigationItems = [
    { name: 'Dashboard', href: '/agent', icon: LayoutDashboard },
    { name: 'Département', href: '/admin/departement', icon: Building2 },
    { name: 'Campagne', href: '/admin/campagne', icon: Target },
    { name: 'Santé', href: '/admin/sante', icon: Heart },
    { name: 'Alimentation', href: '/admin/alimentation', icon: Utensils },
    { name: 'Rapports', href: '/agent/rapports', icon: FileText },
  ]
}

// active route
const isActive = (path) => route.path === path

// logout
const handleLogout = () => {
  localStorage.removeItem('userRole')
  localStorage.removeItem('userName')
}
</script>

<template>
  <!-- Mobile Header -->
  <!-- v-if="currentUser.role && currentUser.role === 'admin'" -->
  <div>
    <div
      class="lg:hidden top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 z-40"
    >
      <h1 class="text-xl">SmartFarm</h1>
      <button @click="sidebarOpen = !sidebarOpen" class="p-2 rounded-md hover:bg-gray-100">
        <Menu v-if="!sidebarOpen" class="w-6 h-6" />
        <X v-else class="w-6 h-6" />
      </button>
    </div>

    <!-- Sidebar -->
    <aside
      :class="[
        'fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-200 ease-in-out lg:translate-x-0',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full',
      ]"
    >
      <div class="flex flex-col h-full">
        <!-- Logo -->
        <div class="h-16 flex items-center px-6 border-b border-gray-200">
          <h1 class="text-xl font-semibold text-green-600">SmartFarm Manager</h1>
        </div>

        <!-- Navigation -->
        <div class="flex-1 px-3 py-4 overflow-y-auto">
          <nav class="space-y-1">
            <div
              v-for="item in navigationItems"
              :key="item.name"
              @click="sidebarOpen = false"
              class="flex items-center gap-3 px-3 py-2 rounded-lg transition-colors"
              :class="
                isActive(item.href)
                  ? 'bg-green-100 text-green-700'
                  : 'text-gray-700 hover:bg-gray-100'
              "
            >
              <component :is="item.icon" class="w-5 h-5" />
              <span>{{ item.name }}</span>
            </div>
          </nav>
        </div>

        <!-- User Info -->
        <div class="p-4 border-t border-gray-200">
          <div class="flex items-center gap-3 mb-3 px-2">
            <div class="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
              <UserCircle class="w-6 h-6 text-green-600" />
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-gray-900 truncate">
                {{ userName }}
              </p>
              <p class="text-xs text-gray-500">Administrateur</p>
            </div>
          </div>

          <button
            @click="handleLogout"
            class="w-full flex items-center justify-center gap-2 border border-gray-300 rounded-md py-2 text-sm hover:bg-gray-50"
          >
            <LogOut class="w-4 h-4" />
            Déconnexion
          </button>
        </div>
      </div>
    </aside>

    <!-- Overlay mobile -->
    <div
      v-if="sidebarOpen"
      class="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
      @click="sidebarOpen = false"
    ></div>
  </div>
</template>
