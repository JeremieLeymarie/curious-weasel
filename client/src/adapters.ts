import type { WorkingTime } from './types'

const _workingTimeFromAPI = (wt: {
  id: string
  start: string
  end: string
  user_id: string
}): WorkingTime => {
  return { id: wt.id, start: new Date(wt.start), end: new Date(wt.end), userId: wt.user_id }
}

export const adapter = {
  from: {
    api: {
      workingTime: _workingTimeFromAPI
    }
  }
}
