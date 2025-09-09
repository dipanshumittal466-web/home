import { createRouter, createWebHistory } from 'vue-router'
import Home from '../pages/Home.vue'
import About from '../pages/About.vue'
import Contact from '../pages/Contact.vue'
import Auth from '../pages/Auth.vue'
import PosterDashboard from '../pages/PosterDashboard.vue'
import ProviderDashboard from '../pages/ProviderDashboard.vue'
import AdminDashboard from '../pages/AdminDashboard.vue'
import CRM from '../pages/CRM.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/about', component: About },
  { path: '/contact', component: Contact },
  { path: '/auth', component: Auth },
  { path: '/poster-dashboard', component: PosterDashboard, meta: { requiresAuth: true, role: 'poster' } },
  { path: '/provider-dashboard', component: ProviderDashboard, meta: { requiresAuth: true, role: 'provider' } },
  { path: '/admin-dashboard', component: AdminDashboard, meta: { requiresAuth: true, role: 'admin' } },
  { path: '/crm', component: CRM, meta: { requiresAuth: true, role: 'admin' } },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  const role = localStorage.getItem('role')

  if (to.meta.requiresAuth && !token) {
    return next('/auth')
  }
  if (to.meta.role && role !== to.meta.role) {
    return next('/auth')
  }
  next()
})

export default router
