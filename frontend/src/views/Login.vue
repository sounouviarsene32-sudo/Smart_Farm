<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '../api/axios.config.js'
import { useLoginStore } from '../stores/login.store.js'
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-vue-next'

const router = useRouter()
const loginStore = useLoginStore()

const email = ref('')
const password = ref('')
const showPassword = ref(false)

const handleLogin = async () => {
  try {
    const response = await api.post('/auth/login', { email: email.value, password: password.value })

    // Vérifie si ton token est directement response.data ou response.data.token
    const token = response.data.token || response.data

    loginStore.login(token)

    // Attends un petit peu ou assure-toi que le store est à jour
    const currentUser = loginStore.getDecodedToken
    if (currentUser && currentUser.role) {
      router.push({ name: `dashboard-${currentUser.role}` })
    }
  } catch (err) {
    console.error('Login failed:', err)
    const errorMessage = err.response?.data?.message || 'Erreur de connexion'
    alert(errorMessage)
  }
}
</script>

<template>
  <!-- Import de la police Inter pour un rendu consistant -->
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap" rel="stylesheet">

  <div class="relative min-h-screen w-full flex items-center justify-end overflow-hidden bg-slate-950 font-['Inter']">

    <!-- IMAGE DE FOND -->
    <div class="absolute inset-0 z-0 scale-105"
      style="background-image: url('https://images.unsplash.com/photo-1516467508483-a7212febe31a?q=80&w=2000'); background-size: cover; background-position: center;">
    </div>

    <!-- PANNEAU DROIT GLASMORPHISM ROUGE #750505 -->
    <div
      class="relative z-10 h-screen w-full md:w-[550px] bg-slate-950/85 backdrop-blur-2xl border-l border-white/10 flex items-center justify-center p-8 md:p-16 shadow-[-20px_0_50px_rgba(0,0,0,0.5)]">

      <div class="w-full max-w-sm">
        <!-- LOGO & TITRE AVEC TYPO ULTRA-BOLD -->
        <div class="text-center mb-12">
          <div
            class="inline-flex items-center justify-center w-20 h-20 bg-white rounded-3xl mb-6 shadow-2xl transition-transform hover:scale-110 duration-500">
            <span class="text-[#750505] font-[900] text-4xl tracking-tighter">SF</span>
          </div>
          <h1 class="text-4xl font-[900] text-white tracking-tighter uppercase leading-none">SmartFarm</h1>
          <p class="text-[10px] font-[900] text-red-200 uppercase tracking-[0.5em] mt-4 opacity-80">Gestion
            Multi-Élevage</p>
        </div>

        <!-- FORMULAIRE -->
        <form @submit.prevent="handleLogin" class="space-y-6">
          <div class="space-y-2">
            <label class="text-[11px] font-[900] uppercase text-white ml-2 tracking-widest">Identifiant</label>
            <div class="relative group">
              <Mail
                class="absolute left-5 top-1/2 -translate-y-1/2 text-gray-800 group-focus-within:text-gray-500 transition-colors"
                :size="18" />
              <input v-model="email" type="email" placeholder="admin@smartfarm.com"
                class="w-full pl-14 pr-6 py-5 bg-black/20 border border-white/10 rounded-2xl text-white placeholder:text-white/20 outline-none focus:border-gray-800 focus:bg-black/30 transition-all font-bold text-sm" />
            </div>
          </div>

          <div class="space-y-2">
            <label class="text-[11px] font-[900] uppercase text-white ml-2 tracking-widest">Mot de passe</label>
            <div class="relative group">
              <Lock
                class="absolute left-5 top-1/2 -translate-y-1/2 text-gray-800 group-focus-within:text-gray-500 transition-colors"
                :size="18" />
              <input v-model="password" :type="showPassword ? 'text' : 'password'" placeholder="••••••••"
                class="w-full pl-14 pr-14 py-5 bg-black/20 border border-white/10 rounded-2xl text-white placeholder:text-white/20 outline-none focus:border-white/40 focus:bg-black/30 transition-all font-bold text-sm" />
              <button type="button" @click="showPassword = !showPassword"
                class="absolute right-5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition-colors">
                <Eye class="text-gray-800" v-if="!showPassword" :size="20" />
                <EyeOff class="text-gray-500" v-else :size="20" />
              </button>
            </div>
          </div>

          <button type="submit"
            class="group w-full bg-white text-[#750505] py-5 rounded-2xl font-[900] text-xs uppercase tracking-[0.2em] shadow-2xl hover:bg-slate-100 transition-all transform active:scale-[0.97] flex items-center justify-center gap-3 mt-8">
            Se Connecter
            <ArrowRight :size="18" class="group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        <!-- FOOTER -->
        <div class="mt-16 text-center border-t border-white/5 pt-8">
          <p class="text-[9px] text-white/30 font-[900] uppercase tracking-[0.4em]">
            Bovins • Porcins • Volaille • Pisciculture
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* On force le lissage des polices pour un rendu "Apple" */

/* On utilise font-[900] pour l'impact maximum */
h1,
span,
label,
button,
p {
  letter-spacing: -0.05em;
  /* Resserre les lettres pour le look pro */
}

/* Exception pour le tracking large des sous-titres */
p {
  letter-spacing: 0.4em !important;
}
</style>
