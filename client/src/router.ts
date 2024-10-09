import { createRouter, createWebHistory } from 'vue-router'

import UserComponent from './components/UserComponent.vue'
import HomeComponent from './components/HomeComponent.vue'
import WorkingTimes from './components/WorkingTime.vue'
import WorkingTimesUpdate from './components/WorkingTimeUpdate.vue'

const routes = [
  { path: '/', component: HomeComponent },
  { path: '/user', component: UserComponent },
  { path: '/workingtime', component: WorkingTimes },
  { path: '/workingtimeupdate', component: WorkingTimesUpdate }
]

export const router = createRouter({
  history: createWebHistory(),
  routes
})
