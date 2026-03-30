<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useLoginStore } from '@/stores/login.store'
import departementService from '@/services/departement.js'
import campaignService from '@/services/campaign.js'
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
  LogOut,
} from 'lucide-vue-next'
import Swal from 'sweetalert2'
const departments = ref([])
const loginStore = useLoginStore()
const currentUser = loginStore.getDecodedToken
const campaigns = ref()
// Dans ton <script setup>, ajoute cette petite fonction pour la navigation dynamique
const goToDepartment = (id) => {
  router.push({ name: 'department-admin', params: { id: id } })
  sidebarOpen.value = false
}



// const loadCampaigns = async () => {
//   try {
//     const data = await campaignService.campaignByDept()
//     campaigns.value = data
//   } catch (err) {
//     console.error(err)
//   }
// }

async function fetchDepartement() {
  try {
    const deptsRes = await departementService.getDepartements()
    departments.value = deptsRes.data || deptsRes
  } catch (error) {
    console.error('Erreur chargement departement asidebar:', error)
  }
}

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
    // { name: 'Stock', href: '/stock', pathName: 'stock-chef', icon: Package },
    // { name: 'Vente', href: '/sales', pathName: 'sales-chef', icon: ShoppingCart },
    // { name: 'Alimentation', href: '/foods', pathName: 'foods-chef', icon: Utensils },
    // { name: 'Santé', href: '/health', pathName: 'health-chef', icon: Heart },
    // { name: 'Animaux', href: '/animals', pathName: 'animals-chef', icon: Beef },
    
    { name: 'Rapports', href: '/rapports', pathName: 'rapports-chef', icon: FileText },
    { name: 'Finances', href: '/finances', pathName: 'finances-chef', icon: DollarSign },
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

// --- LOGIQUE ADMIN ---
if (currentUser && currentUser.role === 'admin') {
  navigationItems = [
    { name: 'Dashboard', href: '/dashboard', pathName: 'dashboard-admin', icon: LayoutDashboard },
    
    // Si c'est juste un titre, on le marque comme tel
    { name: 'Personnel', icon: UserCircle, isHeader: true }, 

    { name: 'Départements', href: '/departments', pathName: 'departments-home', icon: Building2 },
    
    { name: 'Finances', href: '/finances', pathName: 'finances-admin', icon: DollarSign },
    { name: 'Utilisateurs', href: '/users', pathName: 'users', icon: Users },
    { name: 'Rapports', href: '/rapports', pathName: 'rapports-admin', icon: FileText },
  ]
}

const adminColl = [
  { name: 'Agents', href: '/agents', pathName: 'agents' },
  { name: 'Chefs', href: '/chefs', pathName: 'chefs' },
]

const handleLogout = async () => {
  // Confirmation avec SweetAlert2
  const result = await Swal.fire({
    title: 'Confirmer la déconnexion?',
    text: 'Êtes-vous sûr de vouloir vous déconnecter?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#dc2626',
    cancelButtonColor: '#6b7280',
    confirmButtonText: 'Oui, me déconnecter',
    cancelButtonText: 'Annuler',
  })

  if (result.isConfirmed) {
    loginStore.logout()
    router.push('/login')
  }
}

// active route
const isActive = (path) => route.path === path
onMounted(fetchDepartement)
// onMounted(loadCampaigns)
</script>

<template>
  <div>
    <div
      class="lg:hidden fixed top-0 left-0 right-0 h-16 bg-slate-900 flex items-center justify-between px-4 z-50 text-white"
    >
      <h1 class="text-xl font-bold">SmartFarm</h1>
      <button @click="sidebarOpen = !sidebarOpen" class="p-2">
        <Menu v-if="!sidebarOpen" class="w-6 h-6" />
        <X v-else class="w-6 h-6" />
      </button>
    </div>

    <aside
      :class="[
        // Base: caché sur mobile, largeur fixe 16 (64px) sur desktop
        'fixed inset-y-0 left-0 z-50 bg-white border-r border-gray-100 transition-all duration-300 ease-in-out',
        // Desktop Hover: passe de w-16 à w-64
        'hidden lg:flex lg:flex-col lg:w-16 lg:hover:w-64 group/sidebar',
        // Mobile State
        sidebarOpen ? 'translate-x-0 w-64 flex' : '-translate-x-full lg:translate-x-0',
      ]"
    >
      <div class="h-16 flex items-center px-3 border-b border-gray-50 overflow-hidden">
        <div
          class="min-w-[40px] h-10 rounded-xl bg-slate-100 flex items-center justify-center shadow-sm"
        >
          <span class="text-blue-700 text-lg font-black">SF</span>
        </div>
        <span
          class="ml-3 text-blue-600 text-xl font-extrabold whitespace-nowrap opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-300"
        >
          SmartFarm
        </span>
      </div>

      <!-- <div class="flex-1 px-2 py-4 space-y-2 overflow-hidden"> -->
      <nav class="flex-1 px-2 py-4 space-y-2 overflow-y-auto overflow-x-hidden">
        <div v-for="item in navigationItems" :key="item.name">
          <div v-if="item.isHeader" class="group/coll relative">
            <div
              class="relative flex items-center h-12 rounded-lg transition-all group/item text-gray-500 hover:bg-blue-50 hover:text-blue-700"
            >
              <div class="min-w-[48px] flex justify-center">
                <component :is="item.icon" class="w-5 h-5" />
              </div>
              <span
                class="ml-2 whitespace-nowrap font-medium text-sm opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-300"
              >
                {{ item.name }}
              </span>
            </div>

            <ul
              class="hidden group-hover/coll:block lg:ml-12 mt-1 space-y-1 overflow-hidden transition-all duration-300 group-hover/sidebar:max-h-96 max-h-0"
            >
              <li v-for="col in adminColl" :key="col._id || col.id">
                <router-link
                  @click="sidebarOpen = false"
                  :to="{ name: col.pathName }"
                  class="block px-4 py-2 text-xs font-medium text-gray-500 my-1 rounded-md transition-colors whitespace-nowrap"
                  :class="
                    isActive(`/${currentUser.role}${col.href}`)
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                  "
                >
                  • {{ col.name }}
                </router-link>
              </li>
            </ul>
          </div>
          <div v-else-if="item.name === 'Départements'" class="group/dept relative">
            <router-link
              :to="{ name: item.pathName }"
              @click="sidebarOpen = false"
              class="relative flex items-center h-12 rounded-lg transition-all group/item"
              :class="
                isActive(`/${currentUser.role}${item.href}`)
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
              "
            >
              <div class="min-w-[48px] flex justify-center">
                <component :is="item.icon" class="w-5 h-5" />
              </div>
              <span
                class="ml-2 whitespace-nowrap font-medium text-sm opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-300"
              >
                {{ item.name }}
              </span>
            </router-link>

            <ul
              class="hidden group-hover/dept:block lg:ml-12 mt-1 space-y-1 overflow-hidden transition-all duration-300 group-hover/sidebar:max-h-96 max-h-0"
            >
              <li v-for="dept in departments" :key="dept._id || dept.id">
                <router-link
                  v-if="dept._id || dept.id"
                  :to="{ name: 'departments-admin', params: { id: dept._id || dept.id } }"
                  class="block px-4 py-2 text-xs font-medium text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors whitespace-nowrap"
                >
                  • {{ dept.name }}
                </router-link>
              </li>
            </ul>
          </div>
          <!-- <div v-else-if="item.pathName === 'campaigns-chef'" class="group/dept relative">
            <router-link
              :to="{ name: item.pathName }"
              @click="sidebarOpen = false"
              class="relative flex items-center h-12 rounded-lg transition-all group/item"
              :class="
                isActive(`/${currentUser.role}${item.href}`)
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
              "
            >
              <div class="min-w-[48px] flex justify-center">
                <component :is="item.icon" class="w-5 h-5" />
              </div>
              <span
                class="ml-2 whitespace-nowrap font-medium text-sm opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-300"
              >
                {{ item.name }}
              </span>
            </router-link>

            <ul
              class="hidden group-hover/dept:block lg:ml-12 mt-1 space-y-1 overflow-hidden transition-all duration-300 group-hover/sidebar:max-h-96 max-h-0"
            >
              <li v-for="camp in campaigns" :key="camp._id || camp.id">
                <router-link
                  v-if="camp._id || camp.id"
                  :to="{ name: 'campaigns-chef', params: { id: camp._id || camp.id } }"
                  class="block px-4 py-2 text-xs font-medium text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors whitespace-nowrap"
                >
                  • {{ camp.name }}
                </router-link>
              </li>
            </ul>
          </div> -->
          <router-link
            v-else
            :to="{ name: item.pathName }"
            @click="sidebarOpen = false"
            class="relative flex items-center h-12 rounded-lg transition-all group/item"
            :class="
              isActive(`/${currentUser.role}${item.href}`)
                ? 'bg-blue-50 text-blue-700'
                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
            "
          >
            <div class="min-w-[48px] flex justify-center">
              <component :is="item.icon" class="w-5 h-5" />
            </div>
            <span
              class="ml-2 whitespace-nowrap font-medium text-sm opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-300"
            >
              {{ item.name }}
            </span>
          </router-link>
        </div>
      </nav>
      <!-- </div> -->

      <div class="p-2 border-t border-gray-100">
        <button
          @click="handleLogout"
          class="flex items-center w-full h-12 rounded-lg text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors group/logout"
        >
          <div class="min-w-[48px] flex justify-center">
            <LogOut class="w-5 h-5" />
          </div>
          <span
            class="ml-2 whitespace-nowrap font-medium text-sm opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-300"
          >
            Déconnexion
          </span>
        </button>
      </div>
    </aside>

    <div
      v-if="sidebarOpen"
      class="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden"
      @click="sidebarOpen = false"
    ></div>
  </div>
</template>

<!-- <div class="flex">
  <div class="flex h-screen w-16 flex-col justify-between border-e border-gray-100 bg-white">
    <div>
      <div class="inline-flex size-16 items-center justify-center">
        <span class="grid size-10 place-content-center rounded-lg bg-gray-100 text-xs text-gray-600">
          L
        </span>
      </div>

      <div class="border-t border-gray-100">
        <div class="px-2">
          <div class="py-4">
            <a href="#" class="t group relative flex justify-center rounded-sm bg-blue-50 px-2 py-1.5 text-blue-700">
              <svg xmlns="http://www.w3.org/2000/svg" class="size-5 opacity-75" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>

              <span class="invisible absolute start-full top-1/2 ms-4 -translate-y-1/2 rounded-sm bg-gray-900 px-2 py-1.5 text-xs font-medium text-white group-hover:visible">
                General
              </span>
            </a>
          </div>

          <ul class="space-y-1 border-t border-gray-100 pt-4">
            <li>
              <a href="#" class="group relative flex justify-center rounded-sm px-2 py-1.5 text-gray-500 hover:bg-gray-50 hover:text-gray-700">
                <svg xmlns="http://www.w3.org/2000/svg" class="size-5 opacity-75" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>

                <span class="invisible absolute start-full top-1/2 ms-4 -translate-y-1/2 rounded-sm bg-gray-900 px-2 py-1.5 text-xs font-medium text-white group-hover:visible">
                  Teams
                </span>
              </a>
            </li>

            <li>
              <a href="#" class="group relative flex justify-center rounded-sm px-2 py-1.5 text-gray-500 hover:bg-gray-50 hover:text-gray-700">
                <svg xmlns="http://www.w3.org/2000/svg" class="size-5 opacity-75" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
                </svg>

                <span class="invisible absolute start-full top-1/2 ms-4 -translate-y-1/2 rounded-sm bg-gray-900 px-2 py-1.5 text-xs font-medium text-white group-hover:visible">
                  Billing
                </span>
              </a>
            </li>

            <li>
              <a href="#" class="group relative flex justify-center rounded-sm px-2 py-1.5 text-gray-500 hover:bg-gray-50 hover:text-gray-700">
                <svg xmlns="http://www.w3.org/2000/svg" class="size-5 opacity-75" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                </svg>

                <span class="invisible absolute start-full top-1/2 ms-4 -translate-y-1/2 rounded-sm bg-gray-900 px-2 py-1.5 text-xs font-medium text-white group-hover:visible">
                  Invoices
                </span>
              </a>
            </li>

            <li>
              <a href="#" class="group relative flex justify-center rounded-sm px-2 py-1.5 text-gray-500 hover:bg-gray-50 hover:text-gray-700">
                <svg xmlns="http://www.w3.org/2000/svg" class="size-5 opacity-75" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>

                <span class="invisible absolute start-full top-1/2 ms-4 -translate-y-1/2 rounded-sm bg-gray-900 px-2 py-1.5 text-xs font-medium text-white group-hover:visible">
                  Account
                </span>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <div class="sticky inset-x-0 bottom-0 border-t border-gray-100 bg-white p-2">
      <a href="#" class="group relative flex w-full justify-center rounded-lg px-2 py-1.5 text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-700">
        <svg xmlns="http://www.w3.org/2000/svg" class="size-5 opacity-75" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
        </svg>

        <span class="invisible absolute start-full top-1/2 ms-4 -translate-y-1/2 rounded-sm bg-gray-900 px-2 py-1.5 text-xs font-medium text-white group-hover:visible">
          Logout
        </span>
      </a>
    </div>
  </div>

  <div class="flex h-screen flex-1 flex-col justify-between border-e border-gray-100 bg-white">
    <div class="px-4 py-6">
      <ul class="mt-14 space-y-1">
        <li>
          <a href="#" class="block rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700">
            General
          </a>
        </li>

        <li>
          <details class="group [&amp;_summary::-webkit-details-marker]:hidden">
            <summary class="flex cursor-pointer items-center justify-between rounded-lg px-4 py-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700">
              <span class="text-sm font-medium"> Teams </span>

              <span class="shrink-0 transition duration-300 group-open:-rotate-180">
                <svg xmlns="http://www.w3.org/2000/svg" class="size-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                </svg>
              </span>
            </summary>

            <ul class="mt-2 space-y-1 px-4">
              <li>
                <a href="#" class="block rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700">
                  Banned Users
                </a>
              </li>

              <li>
                <a href="#" class="block rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700">
                  Calendar
                </a>
              </li>
            </ul>
          </details>
        </li>

        <li>
          <a href="#" class="block rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700">
            Billing
          </a>
        </li>

        <li>
          <a href="#" class="block rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700">
            Invoices
          </a>
        </li>

        <li>
          <details class="group [&amp;_summary::-webkit-details-marker]:hidden">
            <summary class="flex cursor-pointer items-center justify-between rounded-lg px-4 py-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700">
              <span class="text-sm font-medium"> Account </span>

              <span class="shrink-0 transition duration-300 group-open:-rotate-180">
                <svg xmlns="http://www.w3.org/2000/svg" class="size-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                </svg>
              </span>
            </summary>

            <ul class="mt-2 space-y-1 px-4">
              <li>
                <a href="#" class="block rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700">
                  Details
                </a>
              </li>

              <li>
                <a href="#" class="block rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700">
                  Security
                </a>
              </li>

              <li>
                <a href="#" class="w-full rounded-lg px-4 py-2 [text-align:_inherit] text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700">
                  Logout
                </a>
              </li>
            </ul>
          </details>
        </li>
      </ul>
    </div>
  </div>
</div> -->
