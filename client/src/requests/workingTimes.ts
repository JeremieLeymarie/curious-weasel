export const getWorkingTimes = async (userId: string) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_HOST}:4000/api/workingtimes/${userId}`)
    const data = await response.json()
    return data.data as { id: number; user_id: number; start: string; end: string }[]
  } catch (error) {
    console.error('Error fetching working times:', error)
    return []
  }
}

export const getTeamWorkingTimes = async (teamId: string) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_HOST}:4000/api/workingtimes/team/${teamId}`
    )
    const data = await response.json()
    return data.data as { id: number; user_id: number; start: string; end: string }[]
  } catch (error) {
    console.error('Error fetching working times:', error)
    return []
  }
}
