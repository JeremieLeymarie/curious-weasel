import { createRouter, createWebHistory } from 'vue-router'

import UserComponent from './components/UserComponent.vue'
import HomeComponent from './components/Home.vue'
import NewUser from './components/NewUser.vue'
import WorkingTimesCreated from './components/WorkingTime.vue'
import WorkingTimesUpdate from './components/WorkingTimeUpdate.vue'
import WorkingTimes from './components/WorkingTimes.vue'
import ChartManager from './components/ChartManager.vue'

const routes = [
  { path: '/', component: HomeComponent },
  { path: '/workingtimecreated', component: WorkingTimesCreated },
  { path: '/workingtime', component: WorkingTimes },
  { path: '/workingtimeupdate', component: WorkingTimesUpdate },
  { path: '/user/:id', component: UserComponent },
  { path: '/user/new', component: NewUser },
  { path: '/chart-manager/:userId', component: ChartManager }
]

export const router = createRouter({
  history: createWebHistory(),
  routes
})
