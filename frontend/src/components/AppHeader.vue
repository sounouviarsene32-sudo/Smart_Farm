<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
const router = useRouter()
import { useLoginStore } from '@/stores/login.store'
const loginStore = useLoginStore()
const currentUser = ref(loginStore.getDecodedToken)
import Swal from 'sweetalert2'
import {
  UserCircle,
  LogOut,
} from 'lucide-vue-next'

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
    cancelButtonText: 'Annuler'
  });

  if (result.isConfirmed) {
    loginStore.logout()
    router.push('/login')
  }
}

</script>


<template>

<div class="flex-1 lg:ml-64 p-4 lg:p-8 transition-all duration-300 w-full bg-red-100 space-y-8" >
    
    <div class="flex items-center gap-10 absolute top-2 right-10">
          <div class="flex items-center gap-3 mb-3 px-2">
            <div class="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
              <UserCircle class="w-6 h-6 text-green-600" />
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-gray-900  truncate">
                {{ currentUser?.userName }}
              </p>
              <p class="text-xs text-gray-500">{{ currentUser?.role }}</p>
            </div>
          </div>

          <button
            @click="handleLogout"
            class="cursor-pointer flex items-center text-red-500 justify-center gap-2 rounded-md text-sm hover:text-red-700"
          >
            <LogOut class="w-4 h-4 " />
            Déconnexion
          </button>
        </div>
</div>

</template>


<style scoped>


</style>