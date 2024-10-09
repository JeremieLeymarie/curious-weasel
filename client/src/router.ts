import { createRouter, createWebHistory } from 'vue-router'

import UserComponent from './components/UserComponent.vue'
import NewUser from './components/NewUser.vue'
import HomeComponent from './components/HomeComponent.vue'
import WorkingTimes from './components/WorkingTime.vue'
import WorkingTimesUpdate from './components/WorkingTimeUpdate.vue'

const routes = [
  { path: '/', component: HomeComponent },
  { path: '/workingtime', component: WorkingTimes },
  { path: '/workingtimeupdate', component: WorkingTimesUpdate },
  { path: '/user/:id', component: UserComponent },
  { path: '/user/new', component: NewUser }
]

export const router = createRouter({
  history: createWebHistory(),
  routes
})
