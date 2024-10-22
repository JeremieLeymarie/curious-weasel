import { db, getTmpId } from '@/storage/db'
import { fetcher, isOffline } from './fetch'
import type { APIClock, Clock } from '@/types'
import { adapter } from '@/adapters'

export const createClock = async (userId: string, clock: Omit<APIClock, 'id'>) => {
  if (await isOffline()) {
    await db.clocks.add({ ...clock, id: getTmpId() })
  }

  const response: { data: APIClock } = await fetcher(
    `${import.meta.env.VITE_HOST}:4000/api/clocks/${userId}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ clock })
    }
  )
    .then((res) => res.json())
    .catch((err) => console.error(err))

  return response
}

export const updateClock = async (clock: Omit<Partial<APIClock>, 'id'> & { id: string }) => {
  if (await isOffline()) {
    await db.clocks.update(clock.id, clock)
  }

  return fetcher(`${import.meta.env.VITE_HOST}:4000/api/clocks/${clock.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ clock })
  })
    .then((res) => res.json())
    .catch((err) => console.error(err))
}

export const getClocks = async (userId: string): Promise<Clock[]> => {
  if (await isOffline()) {
    const clocks = await db.clocks.toArray()
    return clocks.map(adapter.from.dexie.to.client.clock)
  }

  const response: { data: APIClock[] } = await fetcher(
    `${import.meta.env.VITE_HOST}:4000/api/clocks/${userId}`
  )
    .then((res) => res.json())
    .catch((err) => console.error(err))

  await db.clocks.clear()
  await db.clocks.bulkPut(response.data.map(adapter.from.api.to.dexie.clock))

  return response.data.map(adapter.from.api.to.client.clock)
}
