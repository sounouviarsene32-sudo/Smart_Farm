<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useLoginStore } from '@/stores/login.store'
const loginStore = useLoginStore()
const currentUser = loginStore.getDecodedToken
// Plus tard pour simuler l'agent :
// console.log('Current User:', currentUser ?? 'No user data available')

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
  Menu,
  X,
  Beef,
} from 'lucide-vue-next'

// router
const route = useRoute()
const router = useRouter()

// state
const sidebarOpen = ref(false)

// navigation
let navigationItems = []

if (currentUser && currentUser.role === 'chef') {
  navigationItems = [
    { name: 'Dashboard', href: '/dashboard', pathName: 'dashboard-chef', icon: LayoutDashboard },
    { name: 'Agents', href: '/agents', pathName: 'agents-chef', icon: UserCircle },
    { name: 'Campagne', href: '/campaigns', pathName: 'campaigns-chef', icon: Target },
    { name: 'Finances', href: '/finances', pathName: 'finances-chef', icon: DollarSign },
    { name: 'Stock', href: '/stock', pathName: 'stock-chef', icon: Package },
    { name: 'Vente', href: '/sales', pathName: 'sales-chef', icon: ShoppingCart },
    { name: 'Alimentation', href: '/foods', pathName: 'foods-chef', icon: Utensils },
    { name: 'Santé', href: '/health', pathName: 'health-chef', icon: Heart },
    { name: 'Animaux', href: '/animals', pathName: 'animals-chef', icon: Beef },
    { name: 'Rapports', href: '/rapports', pathName: 'rapports-chef', icon: FileText },
  ]
}
if (currentUser && currentUser.role === 'agent') {
  navigationItems = [
    { name: 'Dashboard', href: '/dashboard', pathName: 'dashboard-agent', icon: LayoutDashboard },
    { name: 'Campagnes', href: '/campaigns', pathName: 'campaigns-agent', icon: Target },
    { name: 'Animaux', href: '/animals', pathName: 'animals-agent', icon: Beef },
    { name: 'Santé', href: '/health', pathName: 'health-agent', icon: Heart },
    { name: 'Alimentation', href: '/foods', pathName: 'foods-agent', icon: Utensils },
    { name: 'Rapports', href: '/rapports', pathName: 'rapports-agent', icon: FileText },
  ]
}

if (currentUser && currentUser.role == 'admin') {
  navigationItems = [
  { name: 'Dashboard', href: '/dashboard', pathName: 'dashboard-admin', icon: LayoutDashboard },
  { name: 'Agents', href: '/agents', pathName: 'agents', icon: UserCircle },
  { name: 'Chefs', href: '/chefs', pathName: 'chefs', icon: UserCircle },
  { name: 'Utilisateurs', href: '/users', pathName: 'users', icon: Users },
  { name: 'Départements', href: '/departments', pathName: 'departments-admin', icon: Building2 },
  { name: 'Campagnes', href: '/campaigns', pathName: 'campaigns-admin', icon: Target },
  { name: 'Stock', href: '/stock', pathName: 'stock-admin', icon: Package },
  { name: 'Ventes', href: '/sales', pathName: 'sales-admin', icon: ShoppingCart },
  { name: 'Finances', href: '/finances', pathName: 'finances-admin', icon: DollarSign },
  { name: 'Santé', href: '/health', pathName: 'health-admin', icon: Heart },
  { name: 'Alimentation', href: '/foods', pathName: 'foods-admin', icon: Package },
  { name: 'Animaux', href: '/animals', pathName: 'animals-admin', icon: Beef },
  { name: 'Rapports', href: '/rapports', pathName: 'rapports-admin', icon: FileText },
]
}

// active route
const isActive = (path) => route.path === path
</script>

<template>
  <!-- Mobile Header -->
  <!-- v-if="currentUser.role && currentUser.role === 'admin'" -->
  <div>
    <div
      class="lg:hidden top-0 left-0 right-0 h-16 bg-linear-to-br from-slate-950 via-blue-900 to-slate-900 flex items-center justify-between px-4 z-40"
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
       <div class="h-16 flex items-center px-6 border-b border-slate-200 bg-white shadow-sm">
  <h1 class="flex items-center gap-3 text-lg font-bold tracking-tight">
    
    <!-- LOGO -->
    <div class="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-md">
      <span class="text-red-800 text-lg font-black">SF</span>
    </div>

    <!-- TEXTE -->
    <span class="text-red-600 text-xl font-extrabold">
      SmartFarm
    </span>

  </h1>
</div>

        <!-- Navigation -->
        <div class="flex-1 px-3 py-4 overflow-y-auto">
          <nav class="space-y-1">
            <router-link
              :to="{ name: `${item.pathName}` }"
              v-for="item in navigationItems"
              :key="item.name"
              @click="sidebarOpen = false"
              class="flex items-center gap-3 px-3 py-2 rounded-lg transition-colors"
              :class="
                isActive(`/${currentUser.role}${item.href}`)
                  ? 'bg-slate-900/60 text-gray-300'
                  : 'text-gray-400 hover:bg-slate-500/40'
              "
            >
              <component :is="item.icon" class="w-5 h-5" />
              <span>{{ item.name }}</span>
            </router-link>
          </nav>
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
