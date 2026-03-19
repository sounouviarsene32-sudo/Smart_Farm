<script setup>
import DashboardChefComponent from '@/components/DashboardChefComponent.vue'
import DashboardAgentComponent from '@/components/DashboardAgentComponent.vue'
import DashboardAdminComponent from '@/components/DashboardAdminComponent.vue'
import { useLoginStore } from '@/stores/login.store'
const loginStore = useLoginStore()
const currentUser = loginStore.getDecodedToken()

</script>


<template>

<DashboardChefComponent v-if="currentUser && currentUser.role === 'chef'"/>
<DashboardAgentComponent v-if="currentUser && currentUser.role === 'agent'"/>
<DashboardAdminComponent v-if="currentUser && currentUser.role === 'admin'"/>

</template>


<style scoped>


</style>