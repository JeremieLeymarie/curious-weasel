import { db } from '@/storage/db'
import { fetcher, isOffline } from './fetch'
import type { APIClock } from '@/types'

export const createClock = async (userId: string, clock: Omit<APIClock, 'id'>) => {
  const response = await fetcher(`${import.meta.env.VITE_HOST}:4000/api/clocks/${userId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ clock })
  })

  return response
}

export const updateClock = async (clock: Partial<APIClock> & { id: string }) => {
  return fetcher(`${import.meta.env.VITE_HOST}:4000/api/clocks/${clock.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ clock })
  })
}

export const getClocks = async (userId: string) => {
  if (await isOffline()) {
    return await db.clocks.toArray()
  }

  const response: { data: APIClock[] } = await fetcher(
    `${import.meta.env.VITE_HOST}:4000/api/clocks/${userId}`
  )
    .then((res) => res.json())
    .catch((err) => console.error(err))

  await db.clocks.bulkPut(response.data)
  return response.data
}
