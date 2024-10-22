import { createRouter, createWebHistory } from 'vue-router'

import UserComponent from './components/UserComponent.vue'
import HomeComponent from './components/HomePage.vue'
import NewUser from './components/NewUser.vue'
import WorkingTimesCreated from './components/WorkingTime.vue'
import WorkingTimesUpdate from './components/WorkingTimeUpdate.vue'
import WorkingTimes from './components/WorkingTimes.vue'
import UserList from './components/UserList.vue'
import UserRegister from './components/UserRegister.vue'
import { useUserStore } from '@/stores/user'
import TeamManager from './components/teams/TeamManager.vue'
import TeamDetail from './components/teams/TeamDetail.vue'
import UserDashboard from './components/UserDashboard.vue'
import TeamDashboard from './components/TeamDashboard.vue'
import Authentication from './components/AuthenticationComponent.vue'

const routes = [
  { path: '/', component: HomeComponent },
  { path: '/workingtime/new/:userId', component: WorkingTimesCreated },
  { path: '/workingtime/:userId', component: WorkingTimes },
  { path: '/workingtime/update/:id/:start/:end', component: WorkingTimesUpdate },
  { path: '/user/:id', component: UserComponent },
  { path: '/user/new', component: NewUser },
  { path: '/users', component: UserList },
  { path: '/chart-manager/:userId', component: UserDashboard },
  { path: '/chart-manager/team/:teamId', component: TeamDashboard },
  { path: '/register', component: UserRegister },
  { path: '/teams', component: TeamManager },
  { path: '/teams/:teamId', component: TeamDetail },
  { path: '/login', component: Authentication }
]

export const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach(async (to) => {
  const { user } = useUserStore()
  const publicPages = ['/login', '/register']
  const authRequired = !publicPages.includes(to.path)
  if (authRequired && !user) {
    return '/login'
  }
})
