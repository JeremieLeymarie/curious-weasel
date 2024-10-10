import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { User } from '@/types'

export const useUserStore = defineStore('user', () => {
  // TODO: use actual user
  const user = ref<User>({ id: '1', username: 'testman', email: 'test@mail.com', role: 'manager' })

  const setUser = (u: User) => {
    user.value = u
  }

  return { user, setUser }
})
