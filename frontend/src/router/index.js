import AdminLayout from '@/layouts/AdminLayout.vue'
import AgentLayout from '@/layouts/AgentLayout.vue'
import ChefLayout from '@/layouts/ChefLayout.vue'
import { useLoginStore } from '@/stores/login.store'
import AgentListView from '@/views/Agents/AgentListView.vue'
import AnimalList from '@/views/Animals/AnimalList.vue'
import CampaignAdminView from '@/views/Campaigns/CampaignAdminView.vue'
import CampaignDepartmentView from '@/views/Campaigns/CampaignDepartmentView.vue'
import ChefListView from '@/views/Chefs/ChefListView.vue'
import DashboardAdminView from '@/views/Dashboard/DashboardAdminView.vue'
import DashboardAgentView from '@/views/Dashboard/DashboardAgentView.vue'
import DashboardChefView from '@/views/Dashboard/DashboardChefView.vue'
import DepartmentsListView from '@/views/Departments/DepartmentsListView.vue'
import FinanceAdminView from '@/views/Finance/FinanceAdminView.vue'
import FinanceDepartement from '@/views/Finance/FinanceDepartement.vue'
import FoodAdminView from '@/views/Foods/FoodAdminView.vue'
import FoodDepartmentView from '@/views/Foods/FoodDepartmentView.vue'
import VaccineSchedule from '@/views/Health/VaccineSchedule.vue'
import Login from '@/views/Login.vue'
import NotFoundView from '@/views/NotFoundView.vue'
import PageUnauthoriziedView from '@/views/PageUnauthoriziedView.vue'
import RapportsAdminView from '@/views/Rapports/RapportsAdminView.vue'
import RapportsAgentView from '@/views/Rapports/RapportsAgentView.vue'
import RapportsChefView from '@/views/Rapports/RapportsChefView.vue'
import SalesAdminView from '@/views/Sales/SalesAdminView.vue'
import SalesDepartement from '@/views/Sales/SalesDepartement.vue'
import StockView from '@/views/Stock/StockView.vue'
import UserView from '@/views/Users/UserView.vue'
import HealthDepartment from '@/views/Health/HealthDepartment.vue'
import DepartementDetail from '@/views/Departments/DepartementDetail.vue'
import { createRouter, createWebHistory } from 'vue-router'
import CampaignForm from '@/views/Campaigns/CampaignForm.vue'
import CampaignDetail from '@/views/Campaigns/CampaignDetail.vue'
const routes = [
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: NotFoundView,
  },
  {
    path: '/unauthorized',
    name: 'unauthorized',
    component: PageUnauthoriziedView,
  },
  {
    path: '/',
    redirect: { name: 'login' },
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
  },
  {
    path: '/admin',
    name: 'admin',
    component: AdminLayout,
    meta: { requiresAuth: true, role: 'admin' },
    children: [
      {
        path: 'dashboard',
        name: 'dashboard-admin',
        component: DashboardAdminView,
      },
      {
        path: 'agents',
        name: 'agents',
        component: AgentListView,
      },
      {
        path: 'chefs',
        name: 'chefs',
        component: ChefListView,
      },
      {
        path: 'users',
        name: 'users',
        component: UserView,
      },
      {
        path: 'finances',
        name: 'finances-admin',
        component: FinanceAdminView,
      },
      {
        path: 'health',
        name: 'health-admin',
        component: VaccineSchedule,
      },
      {
        path: 'stock',
        name: 'stock-admin',
        component: StockView,
      },
      {
        path: 'sales',
        name: 'sales-admin',
        component: SalesAdminView,
      },
      {
        path: 'departments',
        name: 'departments-admin',
        component: DepartmentsListView,
      },
      {
        path: 'departments/:id', // 👈 Route dynamique pour détails
        name: 'departement-detail',
        component: DepartementDetail,
        meta: { requiresAuth: true, role: 'admin' },
      },
      {
        path: 'campaigns',
        name: 'campaigns-admin',
        component: CampaignAdminView,
      },
      {
        path: '/campaigns/:id',
        name: 'campaigns-detail',
        component: CampaignDetail,
      },
      {
        path: '/admin/campagnes/nouvelle',
        name: 'CampagneAdminForm',
        component: CampaignForm,
      },
      {
        path: 'foods',
        name: 'foods-admin',
        component: FoodAdminView,
      },
      {
        path: 'animals',
        name: 'animals-admin',
        component: AnimalList,
      },
      {
        path: 'rapports',
        name: 'rapports-admin',
        component: RapportsAdminView,
      },
    ],
  },
  {
    path: '/chefDepartment',
    name: 'chef',
    component: ChefLayout,
    meta: { requiresAuth: true, role: 'chef' },
    children: [
      {
        path: 'dashboard',
        name: 'dashboard-chef',
        component: DashboardChefView,
      },
      {
        path: 'animals',
        name: 'animals-chef',
        component: AnimalList,
      },
      {
        path: 'agents',
        name: 'agents-chef',
        component: AgentListView,
      },
      {
        path: 'campaigns',
        name: 'campaigns-chef',
        component: CampaignDepartmentView,
      },
      {
        path: '/chef/campagnes/nouvelle',
        name: 'CampagneDepartmentForm',
        component: CampaignForm,
      },

      {
        path: 'finances',
        name: 'finances-chef',
        component: FinanceDepartement,
      },
      {
        path: 'stock',
        name: 'stock-chef',
        component: StockView,
      },
      {
        path: 'sales',
        name: 'sales-chef',
        component: SalesDepartement,
      },
      {
        path: 'health',
        name: 'health-chef',
        component: HealthDepartment,
      },
      {
        path: 'rapports',
        name: 'rapports-chef',
        component: RapportsChefView,
      },
      {
        path: 'foods',
        name: 'foods-chef',
        component: FoodDepartmentView,
      },
    ],
  },
  {
    path: '/agent',
    name: 'agent',
    component: AgentLayout,
    meta: { requiresAuth: true, role: 'agent' },
    children: [
      {
        path: 'dashboard',
        name: 'dashboard-agent',
        component: DashboardAgentView,
      },
      {
        path: 'animals',
        name: 'animals-agent',
        component: AnimalList,
      },
      {
        path: 'campaigns',
        name: 'campaigns-agent',
        component: CampaignDepartmentView,
      },
      {
        path: 'health',
        name: 'health-agent',
        component: HealthDepartment,
      },
      {
        path: 'rapports',
        name: 'rapports-agent',
        component: RapportsAgentView,
      },
      {
        path: 'foods',
        name: 'foods-agent',
        component: FoodDepartmentView,
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})
router.beforeEach((to, from, next) => {
  const loginStore = useLoginStore()
  const logged = loginStore.token
  const currentUser = loginStore.getDecodedToken

  // 1. Protection des routes privées
  if (to.meta.requiresAuth && !logged) {
  }

  // 2. Redirection si déjà connecté
  if (to.name === 'login' && logged) {
    if (currentUser.role === 'admin') return next({ name: 'dashboard-admin' })
    if (currentUser.role === 'agent') return next({ name: 'dashboard-agent' })
    if (currentUser.role === 'chef') return next({ name: 'dashboard-chef' })
  }

  // 3. Cas par défaut (IMPORTANT : toujours appeler next() ici)
  next()
})
export default router
