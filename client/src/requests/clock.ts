import { fetcher } from './fetch'
import type { APIClock } from '@/adapters'

export const createClock = async (userId: string, clock: APIClock) => {
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
  const response: { data: APIClock[] } = await fetcher(
    `${import.meta.env.VITE_HOST}:4000/api/clocks/${userId}`
  )
    .then((res) => res.json())
    .catch((err) => console.error(err))

  return response.data
}
