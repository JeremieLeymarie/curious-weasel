import type { APIUser, User, UserWithoutId } from '@/types'
import { fetcher, isOffline } from '@/requests/fetch'
import { db } from '@/storage/db'
import { adapter } from '@/adapters'

const USER_BASE_URL = `${import.meta.env.VITE_HOST}:4000/api/users`

export const getUser = async (userId: string) => {
  if (await isOffline()) {
    return await db.users.toArray()
  }

  // Fetch remote data
  const response: { data: APIUser } = await fetcher(`${USER_BASE_URL}/${userId}`)
    .then((res) => res.json())
    .catch((err) => console.error(err))

  // Update local database
  await db.users.put(adapter.from.api.to.dexie.user(response.data))

  return response.data
}

export const getUsers = async () => {
  if (await isOffline()) {
    return await db.users.toArray()
  }

  // Fetch remote data
  const response: { data: APIUser[] } = await fetcher(`${USER_BASE_URL}`)
    .then((res) => res.json())
    .catch((err) => console.error(err))

  // Update local database
  await db.users.clear()
  await db.users.bulkAdd(response.data.map(adapter.from.api.to.dexie.user))

  return response.data
}

export const updateUser = async (user: Partial<User>) => {
  const response: { data: APIUser } = await fetcher(`${USER_BASE_URL}/${user.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user })
  })
    .then((res) => res.json())
    .catch((err) => console.error(err))

  return response.data
}

export const createUser = async (user: UserWithoutId) => {
  const response: { data: APIUser } = await fetch(`${USER_BASE_URL}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user })
  })
    .then((res) => res.json())
    .catch((err) => console.error(err))

  return response.data
}

export const deleteUser = async (userId: string) => {
  await fetcher(`${USER_BASE_URL}/${userId}`, { method: 'DELETE' })
}

export const logOut = async () => {
  localStorage.removeItem('user')
}
