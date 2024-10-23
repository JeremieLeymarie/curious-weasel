import type { APIUser, User } from '@/types'
import { addUpdateRecord, fetcher, isOffline } from '@/requests/fetch'
import { db } from '@/storage/db'
import { adapter } from '@/adapters'

const USER_BASE_URL = `${import.meta.env.VITE_HOST}:4000/api/users`

export const getUser = async (userId: string): Promise<User> => {
  if (await isOffline()) {
    const user = (await db.users.filter((u) => u.id.toString() === userId.toString()).toArray())[0]
    return adapter.from.dexie.to.client.user(user)
  }

  // Fetch remote data
  const response: { data: APIUser } = await fetcher(`${USER_BASE_URL}/${userId}`)
    .then((res) => res.json())
    .catch((err) => console.error(err))

  // Update local database
  await db.users.put(adapter.from.api.to.dexie.user(response.data))

  return adapter.from.api.to.client.user(response.data)
}

export const getUsers = async (): Promise<User[]> => {
  if (await isOffline()) {
    const dexieUsers = await db.users.toArray()
    return dexieUsers.map(adapter.from.dexie.to.client.user)
  }

  // Fetch remote data
  const response: { data: APIUser[] } = await fetcher(`${USER_BASE_URL}`)
    .then((res) => res.json())
    .catch((err) => console.error(err))

  // Update local database
  await db.users.clear()
  await db.users.bulkAdd(response.data.map(adapter.from.api.to.dexie.user))

  return response.data.map(adapter.from.api.to.client.user)
}

export const updateUser = async (user: Partial<User> & { id: string }) => {
  const URL = `${USER_BASE_URL}/${user.id}`

  if (await isOffline()) {
    const updatedUser = { ...(await db.users.get(user.id)), ...user }
    await db.users.update(user.id, updatedUser)
    await addUpdateRecord(URL, user.id, { body: { user: updatedUser } })
    return
  }

  const response: { data: APIUser } = await fetcher(URL, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user })
  })
    .then((res) => res.json())
    .catch((err) => console.error(err))

  return response.data
}

export const deleteUser = async (userId: string) => {
  if (await isOffline()) {
    throw new Error('Cannot delete user: network unreachable')
  }

  await fetcher(`${USER_BASE_URL}/${userId}`, { method: 'DELETE' })
}

export const logOut = async () => {
  localStorage.removeItem('user')
}
