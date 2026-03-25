<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
const router = useRouter()
import { useLoginStore } from '@/stores/login.store'
const loginStore = useLoginStore()
const currentUser = ref(loginStore.getDecodedToken)
import { UserCircle, LogOut } from 'lucide-vue-next'

const handleLogout = () => {
  loginStore.logout()
  router.push('/login')
}
</script>

<template>
  <div
    class="flex-1 lg:ml-64 p-4 lg:p-8 transition-all duration-300 w-full bg-[#0f172a] text-white space-y-8"
  >
    <div class="flex items-center gap-10 absolute top-2 right-10">
      <div class="flex items-center gap-3 mb-3 px-2">
        <div class="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
          <UserCircle class="w-6 h-6 text-white" />
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium text-white truncate">
            {{ currentUser?.userName }}
          </p>
          <p class="text-xs text-gray-500">{{ currentUser?.role }}</p>
        </div>
      </div>

      <button
        @click="handleLogout"
        class="cursor-pointer flex items-center text-blue-200 justify-center gap-2 rounded-md text-sm hover:text-blue-400"
      >
        <LogOut class="w-4 h-4" />
        Déconnexion
      </button>
    </div>
  </div>
</template>
<style scoped>
/* Optionnel : override global app header */
.app-header {
  background: #0f172a;
  color: #f8fafc;
}
</style>
