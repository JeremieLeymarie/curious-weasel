import { BASE_API_URL } from '@/constants'
import type { Team } from '@/types'

export const getTeams = async () => {
  const response: { data: Team[] } = await fetch(`${BASE_API_URL}/teams`)
    .then((res) => res.json())
    .catch((err) => console.error(err))

  return response.data
}

export const getTeam = async (teamId: string) => {
  const response: { data: Team } = await fetch(`${BASE_API_URL}/teams/${teamId}`)
    .then((res) => res.json())
    .catch((err) => console.error(err))

  return response.data
}

export const updateTeam = async (team: { id: string; name?: string; user_ids?: string[] }) => {
  const response: { data: Team } = await fetch(`${BASE_API_URL}/teams/${team.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ team })
  })
    .then((res) => res.json())
    .catch((err) => console.error(err))

  return response.data
}
