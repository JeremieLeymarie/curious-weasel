import { BASE_API_URL } from '@/constants'
import type { Team } from '@/types'

export const getTeams = async () => {
  const response: { data: Team[] } = await fetch(`${BASE_API_URL}/teams`)
    .then((res) => res.json())
    .catch((err) => console.error(err))

  return response.data
}
