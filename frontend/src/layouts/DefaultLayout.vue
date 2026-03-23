<script setup>
import AppSidebar from '@/components/AppSidebar.vue'
import AnimalList from '@/views/Animals/AnimalList.vue'
import AppHeader from '@/components/AppHeader.vue'
import Login from '@/views/Login.vue';

</script>

<template>
<AppHeader/>
  <div class="flex min-h-screen bg-[#F8F9FA]">
    <AppSidebar :sidebar-open="sidebarOpen" @close="sidebarOpen = false" />
    <Login />
  </div>
</template>

<style scoped></style>
