<script setup>
import AppHeader from '@/components/AppHeader.vue'
import AppSidebar from '@/components/AppSidebar.vue'

</script>


<template>

<AppHeader/>
  <div class="flex min-h-screen bg-[#F8F9FA]">
    <AppSidebar :sidebar-open="sidebarOpen" @close="sidebarOpen = false" />
    <router-view></router-view>
  </div>

</template>


<style scoped>


</style>