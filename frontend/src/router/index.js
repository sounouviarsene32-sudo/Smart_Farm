import { useLoginStore } from '@/stores/login.store'
import UserAdmin from '@/views/Admin/UserAdmin.vue'
import Login from '@/views/Login.vue'
import NotFoundView from '@/views/NotFoundView.vue'
import PageUnauthoriziedView from '@/views/PageUnauthoriziedView.vue'
import { createRouter, createWebHistory } from 'vue-router'

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
    path: '/users',
    name: 'users',
    component: UserAdmin,
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach((to, from, next) => {
  const loginStore = useLoginStore()
  const logged = loginStore.token
  // const userRole = loginStore.currentUser.role

  // if (to.meta.requiresAuth && !logged) {
  //   next({ name: 'login' })
  // } 
  // else if (to.name === 'login' && logged) {
  //   if (userRole === 'admin') {
  //     next({ name: 'dashboard-admin' })
  //   }
  //   if (userRole === 'doctor') {
  //     next({ name: 'dashboard-doctor' })
  //   }
  //   if (userRole === 'receptionnist') {
  //     next({ name: 'dashboard-receptionnist' })
  //   }
  // } 
  // if (to.meta.role && to.meta.role !== userRole) {
  //   return next({ name: 'unauthorized' })
  // }
//  else {
//    next()
//  }
})
export default router
