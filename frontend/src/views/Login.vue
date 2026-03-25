<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import authService from '../services/auth.js'
import api from '../api/axios.config.js'
import { useLoginStore } from '../stores/login.store.js'
import { LayoutGrid, Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-vue-next'

const router = useRouter()
const loginStore = useLoginStore()

const email = ref('')
const password = ref('')
const showPassword = ref(false)

const handleLogin = async () => {
  try {
    const response = await api.post('/auth/login', { email: email.value, password: password.value })
    const data = response.data
    if (data.success) {
      loginStore.login(data.token) // Stocke le token dans le store
      const currentUser = loginStore.getDecodedToken
      router.push({ name: `dashboard-${currentUser.role}` })
    } else {
      alert(data.message || 'Erreur de connexion')
    }
  } catch (err) {
    console.error('Login failed:', err)
    const errorMessage = err.response?.data?.message || 'Erreur de connexion'
    alert(errorMessage)
  }
}
</script>
<!-- class="flex-1 lg:ml-64 p-4 lg:p-8 transition-all duration-300 w-full p-8 bg-[#F8F9FA] min-h-screen space-y-8" -->
<template>
  <div class="tex-center w-full min-h-screen bg-[#F8F9FA] flex items-center justify-center p-6">
    <div class="w-full max-w-md bg-white border border-slate-100 shadow-xl shadow-slate-200/50 p-10">
      <div class="text-center mb-10">
        <div class="inline-flex items-center justify-center mb-6 shadow-lg shadow-slate-200">
          <!-- <LayoutGrid class="text-gray-300 w-8 h-8" /> -->

          <svg width="70" height="70" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="0" y="0" width="100" height="100" rx="20" fill="#750505" />

            <text x="50" y="62" font-family="Inter, system-ui, Arial, sans-serif" font-size="40" font-weight="900"
              class="fill-gray-100" text-anchor="middle" letter-spacing="-1">
              SF
            </text>
          </svg>
        </div>
        <h1 class="text-3xl font-extrabold text-red-900 tracking-tight">Bienvenue</h1>
        <p class="text-slate-400 text-sm mt-2 font-medium">
          Connectez-vous pour accéder à SmartFarm
        </p>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-6">
        <div class="space-y-2">
          <label class="text-[11px] font-bold uppercase tracking-widest text-slate-400 ml-1">Adresse Email</label>
          <div class="relative group">
            <Mail
              class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-slate-950 transition-colors" />
            <input v-model="email" type="email" placeholder="nom@exemple.com"
              class="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-slate-950/5 focus:bg-white focus:border-slate-950 transition-all"
              required />
          </div>
        </div>

        <div class="space-y-2">
          <div class="flex justify-between items-end ml-1">
            <label class="text-[11px] font-bold uppercase tracking-widest text-slate-400">Mot de passe</label>
            <a href="#" class="text-[11px] font-bold text-blue-600 hover:underline">Oublié ?</a>
          </div>
          <div class="relative group">
            <Lock
              class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-slate-950 transition-colors" />
            <input v-model="password" :type="showPassword ? 'text' : 'password'" placeholder="••••••••"
              class="w-full pl-12 pr-12 py-4 bg-slate-50 border border-slate-100 rounded-lg text-sm outline-none focus:ring-2 focus:ring-slate-950/5 focus:bg-white focus:border-slate-950 transition-all"
              required />
            <button type="button" @click="showPassword = !showPassword"
              class="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-600 transition-colors">
              <component :is="showPassword ? EyeOff : Eye" class="w-5 h-5" />
            </button>
          </div>
        </div>

        <button type="submit"
          class="cursor-pointer w-full bg-red-900 text-white py-4 rounded-lg font-bold text-sm shadow-lg shadow-red-200 hover:bg-red-950 transition-all active:scale-[0.98] mt-4 flex items-center justify-center gap-2">
          Se connecter
          <ArrowRight class="w-4 h-4" />
        </button>
      </form>

      <div class="mt-10 text-center">
        <p class="text-xs text-slate-400 font-medium">
          Vous n'avez pas de compte ?
          <span href="#" class="text-slate-950 font-bold cursor-pointer hover:underline">Contactez l'admin</span>
        </p>
      </div>
    </div>
  </div>
</template>
