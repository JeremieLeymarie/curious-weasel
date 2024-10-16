import type { Clock, WorkingTime } from './types'

const _workingTimeFromAPI = (wt: {
  id: number
  start: string
  end: string
  user_id: number
}): WorkingTime => {
  return {
    id: wt.id.toString(),
    start: new Date(wt.start),
    end: new Date(wt.end),
    userId: wt.user_id?.toString()
  }
}

const _clockFromAPI = (clock: { id: number; status: boolean; time: string }): Clock => {
  return { id: clock.id.toString(), status: clock.status, time: new Date(clock.time) }
}

export const adapter = {
  from: {
    api: {
      workingTime: _workingTimeFromAPI,
      clock: _clockFromAPI
    }
  }
}
