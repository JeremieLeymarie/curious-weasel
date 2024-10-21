import type { User } from '@/types'
import { appFetch } from '@/requests/fetch'

const USER_BASE_URL = `${import.meta.env.VITE_HOST}:4000/api/users`

export const getUser = async (userId: string) => {
  console.log(import.meta.env)
  const response: { data: User } = await appFetch(`${USER_BASE_URL}/${userId}`)
    .then((res) => res.json())
    .catch((err) => console.error(err))

  return response.data
}

export const getUsers = async () => {
  const response: { data: User[] } = await appFetch(`${USER_BASE_URL}`)
    .then((res) => res.json())
    .catch((err) => console.error(err))

  return response.data
}

export const updateUser = async (user: Partial<User>) => {
  const response: { data: User } = await appFetch(`${USER_BASE_URL}/${user.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user })
  })
    .then((res) => res.json())
    .catch((err) => console.error(err))

  return response.data
}

export const deleteUser = async (userId: string) => {
  await appFetch(`${USER_BASE_URL}/${userId}`, { method: 'DELETE' })
}

export const logOut = async () => {
  localStorage.removeItem('user')
}
