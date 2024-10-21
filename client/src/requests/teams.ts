import { BASE_API_URL } from '@/constants'
import type { Team } from '@/types'
import { fetcher, isOffline } from './fetch'
import { db } from '@/storage/db'

export const getTeams = async () => {
  const response: { data: Team[] } = await fetcher(`${BASE_API_URL}/teams`)
    .then((res) => res.json())
    .catch((err) => console.error(err))

  return response.data
}

export const getTeam = async (teamId: string) => {
  if (await isOffline()) return db.teams.get(teamId)

  const response: { data: Team } = await fetcher(`${BASE_API_URL}/teams/${teamId}`)
    .then((res) => res.json())
    .catch((err) => console.error(err))

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

export type APITeam = {
  name: string
  user_ids: string[]
  manager_id: string
}
export const createTeam = async (team: APITeam) => {
  const response = await fetcher(`${BASE_API_URL}/teams`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ team })
  })

  return response
}
