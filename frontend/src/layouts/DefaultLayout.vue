<script setup>
import AgentManager from '@/views/Agents/AgentManager.vue'
import ChefManager from '@/views/Chefs/ChefManager.vue'
import AppSidebar from '@/components/AppSidebar.vue'
import DashboardChefComponent from '@/components/DashboardChefComponent.vue'
import DashboardAgentComponent from '@/components/DashboardAgentComponent.vue'
import DashboardAdminComponent from '@/components/DashboardAdminComponent.vue'
import UserView from '@/views/Users/UserView.vue'
</script>

<template>
  <div class="flex min-h-screen bg-[#F8F9FA]">
    <AppSidebar :sidebar-open="sidebarOpen" @close="sidebarOpen = false" />
    <!-- <ChefManager /> -->
    <!-- <AgentManager /> -->
    <UserView />
  </div>
</template>

<style scoped></style>
