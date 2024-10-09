import { createRouter, createWebHistory } from 'vue-router'

import UserComponent from './components/UserComponent.vue'
import HomeComponent from './components/HomeComponent.vue'

const routes = [
  { path: '/', component: HomeComponent },
  { path: '/user', component: UserComponent }
]

export const router = createRouter({
  history: createWebHistory(),
  routes
})
