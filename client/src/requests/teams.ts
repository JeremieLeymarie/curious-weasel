import { BASE_API_URL } from '@/constants'
import type { APITeam, APITeamRequest, Team } from '@/types'
import { fetcher, isOffline } from './fetch'
import { db } from '@/storage/db'
import { adapter } from '@/adapters'

export const getTeams = async (): Promise<Team[]> => {
  if (await isOffline()) {
    const dexieTeams = await db.teams.toArray()
    return dexieTeams.map(adapter.from.dexie.to.client.team)
  }

  const response: { data: APITeam[] } = await fetcher(`${BASE_API_URL}/teams`)
    .then((res) => res.json())
    .catch((err) => console.error(err))

  await db.teams.clear()
  await db.teams.bulkAdd(response.data.map(adapter.from.api.to.dexie.team))

  return response.data.map(adapter.from.api.to.client.team)
}

export const getTeam = async (teamId: string): Promise<Team> => {
  if (await isOffline()) {
    const team = await db.teams.get(teamId)
    if (!team) throw new Error(`Team ${teamId} not found in local database`)
    return adapter.from.dexie.to.client.team(team)
  }

  const response: { data: APITeam } = await fetcher(`${BASE_API_URL}/teams/${teamId}`)
    .then((res) => res.json())
    .catch((err) => console.error(err))

  db.teams.put(adapter.from.api.to.dexie.team(response.data))

  return adapter.from.api.to.client.team(response.data)
}

export const updateTeam = async (team: { id: string; name?: string; user_ids?: string[] }) => {
  const response: { data: APITeam } = await fetcher(`${BASE_API_URL}/teams/${team.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ team })
  })
    .then((res) => res.json())
    .catch((err) => console.error(err))

  return response.data
}

export const createTeam = async (team: Omit<APITeamRequest, 'id'>) => {
  const response = await fetcher(`${BASE_API_URL}/teams`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ team })
  })

  return response
}
