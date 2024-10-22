import { BASE_API_URL } from '@/constants'
import type { APITeam, Team } from '@/types'
import { fetcher, isOffline } from './fetch'
import { db } from '@/storage/db'

export const getTeams = async () => {
  if (await isOffline()) return db.teams.toArray()

  const response: { data: Team[] } = await fetcher(`${BASE_API_URL}/teams`)
    .then((res) => res.json())
    .catch((err) => console.error(err))

  db.teams.clear()
  const dexieTeams = response.data.map((team) => ({
    ...team,
    users: team.users ?? null,
    manager: team.manager ?? null,
    id: Number(team.id)
  }))
  db.teams.bulkAdd(dexieTeams)

  return response.data
}

export const getTeam = async (teamId: string) => {
  if (await isOffline()) return db.teams.get(Number(teamId))

  const response: { data: Team } = await fetcher(`${BASE_API_URL}/teams/${teamId}`)
    .then((res) => res.json())
    .catch((err) => console.error(err))

  db.teams.put({
    ...response.data,
    users: response.data.users ?? null,
    manager: response.data.manager ?? null,
    id: Number(response.data.id)
  })
  return response.data
}

export const updateTeam = async (team: { id: string; name?: string; user_ids?: string[] }) => {
  const response: { data: Team } = await fetcher(`${BASE_API_URL}/teams/${team.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ team })
  })
    .then((res) => res.json())
    .catch((err) => console.error(err))

  return response.data
}

export const createTeam = async (team: Omit<APITeam, 'id'>) => {
  const response = await fetcher(`${BASE_API_URL}/teams`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ team })
  })

  return response
}
