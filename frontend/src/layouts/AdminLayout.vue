<script setup>
import AppHeader from '@/components/AppHeader.vue'
import AppSidebar from '@/components/AppSidebar.vue'

</script>


<template>

<AppHeader/>
  <div class="flex min-h-screen bg-[#F8F9FA]">
    <AppSidebar :sidebar-open="sidebarOpen" @close="sidebarOpen = false" />
    <div class="flex-1 w-60 p-4 lg:p-8 bg-slate-50 min-h-screen space-y-8"" >
      <div class="flex-1 p-4 lg:p-10 bg-slate-50 min-h-screen space-y-8 lg:ml-16">
  <router-view></router-view>
</div>
    </div>
  </div>

</template>


<style scoped>


</style>