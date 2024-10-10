import type { User } from '@/types'

const USER_BASE_URL = 'http://localhost:4000/api/users'

export const getUser = async (userId: string) => {
  const response: { data: User } = await fetch(`${USER_BASE_URL}/${userId}`)
    .then((res) => res.json())
    .catch((err) => console.error(err))

  return response.data
}

export const getUsers = async () => {
  const response: { data: User[] } = await fetch(`${USER_BASE_URL}`)
    .then((res) => res.json())
    .catch((err) => console.error(err))

  return response.data
}

export const updateUser = async (user: User) => {
  const response: { data: User } = await fetch(`${USER_BASE_URL}/${user.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user })
  })
    .then((res) => res.json())
    .catch((err) => console.error(err))

  return response.data
}

export const deleteUser = async (userId: string) => {
  await fetch(`${USER_BASE_URL}/${userId}`, { method: 'DELETE' })
}
