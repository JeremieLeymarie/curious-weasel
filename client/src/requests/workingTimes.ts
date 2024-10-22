import type { APIWorkingTime, WorkingTime } from '@/types'
import { fetcher, isOffline } from './fetch'
import { db } from '@/storage/db'
import { adapter } from '@/adapters'

export const getWorkingTimes = async (userId: string): Promise<WorkingTime[]> => {
  if (await isOffline()) {
    const dexieWTs = await db.workingTimes.filter((wt) => wt.userId === userId).toArray()
    return dexieWTs.map(adapter.from.dexie.to.client.workingTime)
  }

  const response: { data: APIWorkingTime[] } = await fetcher(
    `${import.meta.env.VITE_HOST}:4000/api/workingtimes/${userId}`
  )
    .then((res) => res.json())
    .catch((err) => console.error(err))

  await db.workingTimes.bulkPut(
    response.data.map((wt) => adapter.from.api.to.dexie.workingTime(wt, { userId }))
  )

  return response.data.map(adapter.from.api.to.client.workingTime)
}

export const getTeamWorkingTimes = async (teamId: string): Promise<WorkingTime[]> => {
  if (await isOffline()) {
    const dexieWTs = await db.workingTimes.filter((wt) => wt.teamId === teamId).toArray()
    return dexieWTs.map(adapter.from.dexie.to.client.workingTime)
  }

  const response: { data: APIWorkingTime[] } = await fetcher(
    `${import.meta.env.VITE_HOST}:4000/api/workingtimes/team/${teamId}`
  )
    .then((res) => res.json())
    .catch((err) => console.error(err))

  await response.data.map((wt) => adapter.from.api.to.dexie.workingTime(wt, { teamId }))

  return response.data.map(adapter.from.api.to.client.workingTime)
}

export const createWorkingTime = async (userId: string, wt: { start: string; end: string }) => {
  return fetcher(`${import.meta.env.VITE_HOST}:4000/api/workingtimes/${userId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ working_time: wt })
  })
}

export const deleteWorkingTime = async (id: string) => {
  return await fetcher(`${import.meta.env.VITE_HOST}:4000/api/workingtimes/${id}`, {
    method: 'DELETE'
  })
}

export const updateWorkingTimes = async (wt: { end: string; start: string; id: string }) => {
  return await fetcher(`${import.meta.env.VITE_HOST}:4000/api/workingtimes/${wt.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      working_time: wt
    })
  })
}
