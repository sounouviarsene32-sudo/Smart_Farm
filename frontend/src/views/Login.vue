<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '../api/axios.config.js'
import { useLoginStore } from '../stores/login.store.js'
const router = useRouter()
const loginStore = useLoginStore()
import { LayoutGrid, Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-vue-next'

const email = ref('')
const password = ref('')
const showPassword = ref(false)

const handleLogin = async () => {
  try {
    const response = await api.post('/auth/login', { email: email.value, password: password.value })
    const token = response.data
    loginStore.login(token) // Stocke le token dans le store
    const currentUser = loginStore.getDecodedToken    
    router.push({name: `dashboard-${currentUser.role}` })
  } catch (err) {
    console.error('Login failed:', err)
  }
}
</script>
<!-- class="flex-1 lg:ml-64 p-4 lg:p-8 transition-all duration-300 w-full p-8 bg-[#F8F9FA] min-h-screen space-y-8" -->
<template>
  <div 
    class="relative min-h-screen w-full flex items-center justify-center p-6 bg-slate-900"
    style="background-image: linear-gradient(rgba(69, 10, 10, 0.7), rgba(9, 9, 11, 0.9)), url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2000'); background-size: cover; background-position: center;"
  >
    
    <div class="relative z-10 w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-white/20">
      
      <div class="h-2 w-full bg-[#750505]"></div>

      <div class="p-10 md:p-14">
        <div class="text-center mb-10">
          <div class="inline-flex items-center justify-center w-20 h-20 bg-[#750505] rounded-3xl mb-6 shadow-xl">
             <span class="text-white font-black text-4xl">SF</span>
          </div>
          <h1 class="text-4xl font-black text-slate-900 tracking-tighter uppercase">SmartFarm</h1>
          <p class="text-[10px] font-black text-red-800 uppercase tracking-[0.4em] mt-2">Gestion Multi-Élevage</p>
        </div>

        <form @submit.prevent="handleLogin" class="space-y-6">
          <div class="space-y-2">
            <label class="text-[11px] font-black uppercase text-slate-400 ml-4">Identifiant</label>
            <input
              v-model="email"
              type="email"
              placeholder="admin@smartfarm.com"
              class="w-full px-6 py-5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none focus:border-red-800 transition-all"
            />
          </div>

          <div class="space-y-2">
            <label class="text-[11px] font-black uppercase text-slate-400 ml-4">Mot de passe</label>
            <input
              v-model="password"
              type="password"
              placeholder="••••••••"
              class="w-full px-6 py-5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none focus:border-red-800 transition-all"
            />
          </div>

          <button
            type="submit"
            class="w-full bg-[#750505] text-white py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-lg hover:bg-red-900 transition-all transform active:scale-95"
          >
            Se Connecter
          </button>
        </form>

        <div class="mt-10 text-center border-t border-slate-100 pt-8">
           <p class="text-[9px] text-slate-400 font-bold uppercase tracking-widest">
            Bovins • Porcins • Volaille • Pisciculture
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
<style>
/* On utilise une police système ultra-pro pour éviter tout délai de chargement */
body {
  font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  margin: 0;
  padding: 0;
}
</style>