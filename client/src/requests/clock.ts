import { db, getTmpId } from '@/storage/db'
import { addCreateRecord, addUpdateRecord, fetcher, isOffline } from './fetch'
import type { APIClock, Clock } from '@/types'
import { adapter } from '@/adapters'

export const createClock = async (userId: string, clock: Omit<APIClock, 'id'>) => {
  const URL = `${import.meta.env.VITE_HOST}:4000/api/clocks/${userId}`

  if (await isOffline()) {
    const tmpId = getTmpId()
    await db.clocks.add({ ...clock, id: tmpId })
    await addCreateRecord(URL, tmpId, { clock })
    return
  }

  const response: { data: APIClock } = await fetcher(URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ clock })
  })
    .then((res) => res.json())
    .catch((err) => console.error(err))

  return response
}

export const updateClock = async (clock: Omit<Partial<APIClock>, 'id'> & { id: string }) => {
  const URL = `${import.meta.env.VITE_HOST}:4000/api/clocks/${clock.id}`

  if (await isOffline()) {
    const updatedClock = { ...(await db.clocks.get(clock.id)), ...clock }
    await db.clocks.update(clock.id, updatedClock)
    await addUpdateRecord(URL, clock.id, { clock: updatedClock })
    return
  }

  return fetcher(URL, {
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
