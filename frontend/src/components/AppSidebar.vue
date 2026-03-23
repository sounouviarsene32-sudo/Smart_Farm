<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useLoginStore } from '@/stores/login.store'
const loginStore = useLoginStore()
// const currentUser = loginStore.getDecodedToken
const currentUser = { name: 'Théodore', role: 'admin' }
// Plus tard pour simuler l'agent :
currentUser.role = 'admin'
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
          <h1 class="text-xl flex justify-center gap-5 font-semibold text-red-600">
            <svg
              width="30"
              height="30"
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect x="0" y="0" width="100" height="100" rx="20" fill="#EF4444" />

              <text
                x="50"
                y="62"
                font-family="Inter, system-ui, Arial, sans-serif"
                font-size="40"
                font-weight="900"
                fill="white"
                text-anchor="middle"
                letter-spacing="-1"
              >
                SF
              </text>
            </svg>
            <span>SmartFarm</span>
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
                  ? 'bg-red-100 text-red-800'
                  : 'text-gray-700 hover:bg-red-50'
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
