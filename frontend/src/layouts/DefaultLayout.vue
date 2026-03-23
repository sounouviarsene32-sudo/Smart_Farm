<script setup>
import AppSidebar from '@/components/AppSidebar.vue'
import AnimalList from '@/views/Animals/AnimalList.vue'
import AppHeader from '@/components/AppHeader.vue'
import Login from '@/views/Login.vue'
import CampaignAdminView from '@/views/Campaigns/CampaignAdminView.vue'
import DepartmentsListView from '@/views/Departments/DepartmentsListView.vue'
import DepartementDetail from '@/views/Departments/DepartementDetail.vue'
import FinanceAdminView from '@/views/Finance/FinanceAdminView.vue'
import AgentList from '@/views/Agents/AgentListView.vue'
import CampaignDetail from '@/views/Campaigns/CampaignDetail.vue'
import FinanceDepartement from '@/views/Finance/FinanceDepartement.vue'
import FoodDepartmentView from '@/views/Foods/FoodDepartmentView.vue'
import FoodAdminView from '@/views/Foods/FoodAdminView.vue'
import VaccineSchedule from '@/views/Health/VaccineSchedule.vue'
import HealthDepartment from '@/views/Health/HealthDepartment.vue'
import RapportsAdminView from '@/views/Rapports/RapportsAdminView.vue'
import SalesAdminView from '@/views/Sales/SalesAdminView.vue'
import SalesDepartement from '@/views/Sales/SalesDepartement.vue'
import StockView from '@/views/Stock/StockView.vue'
</script>

<template>
  <AppHeader />
  <div class="flex min-h-screen bg-[#F8F9FA]">
    <AppSidebar :sidebar-open="sidebarOpen" @close="sidebarOpen = false" />
    <!-- <DepartmentsListView /> -->
    <!-- <AgentList /> -->
    <!-- <DepartementDetail /> -->
    <!-- <CampaignDetail /> -->
    <!-- <FinanceDepartement /> -->
    <!-- <FoodAdminView /> -->
    <!-- <FinanceDepartement /> -->
    <!-- <FinanceAdminView /> -->
    <!-- <FoodDepartmentView /> -->
    <!-- <FoodDepartmentView /> -->
    <!-- <VaccineSchedule /> -->
    <!-- <HealthDepartment /> -->
    <!-- <HealthDepartment /> -->
    <!-- <RapportsAdminView /> -->
    <!-- <SalesAdminView /> -->
    <!-- <SalesDepartement /> -->
    <StockView />
  </div>
</template>

<style scoped></style>
