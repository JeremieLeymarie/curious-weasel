import { createRouter, createWebHistory } from 'vue-router'

import UserComponent from './components/UserComponent.vue'
import HomeComponent from './components/HomePage.vue'
import NewUser from './components/NewUser.vue'
import WorkingTimesCreated from './components/WorkingTime.vue'
import WorkingTimesUpdate from './components/WorkingTimeUpdate.vue'
import WorkingTimes from './components/WorkingTimes.vue'
import ChartManager from './components/ChartManager.vue'
import UserList from './components/UserList.vue'
import Login from './components/Login.vue'
import { useUserStore } from '@/stores/user'
import TeamManager from './components/TeamManager.vue'

const routes = [
  { path: '/', component: HomeComponent },
  { path: '/workingtime/new', component: WorkingTimesCreated },
  { path: '/workingtime/:userId', component: WorkingTimes },
  { path: '/workingtime/update/:id/:start/:end', component: WorkingTimesUpdate },
  { path: '/user/:id', component: UserComponent },
  { path: '/user/new', component: NewUser },
  { path: '/users', component: UserList },
  { path: '/chart-manager/:userId', component: ChartManager },
  { path: '/login', component: Login },
  { path: '/teams', component: TeamManager }
]

export const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach(async (to) => {
  const { user } = useUserStore()
  const publicPages = ['/login']
  const authRequired = !publicPages.includes(to.path)
  if (authRequired && !user) {
    return '/login'
  }
})
