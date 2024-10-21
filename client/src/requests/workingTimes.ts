import { fetcher } from './fetch'

export const getWorkingTimes = async (userId: string) => {
  try {
    const response = await fetcher(`${import.meta.env.VITE_HOST}:4000/api/workingtimes/${userId}`)
    const data = await response.json()
    return data.data as { id: number; user_id: number; start: string; end: string }[]
  } catch (error) {
    console.error('Error fetching working times:', error)
    return []
  }
}

export const getTeamWorkingTimes = async (teamId: string) => {
  try {
    const response = await fetcher(
      `${import.meta.env.VITE_HOST}:4000/api/workingtimes/team/${teamId}`
    )
    const data = await response.json()
    return data.data as { id: number; user_id: number; start: string; end: string }[]
  } catch (error) {
    console.error('Error fetching working times:', error)
    return []
  }
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
