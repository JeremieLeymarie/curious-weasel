import type { DexieUser } from './storage/db'
import type { APIClock, APIUser, APIWorkingTime, Clock, WorkingTime } from './types'

const _workingTimeFromAPI = (wt: APIWorkingTime): WorkingTime => {
  return {
    id: wt.id.toString(),
    start: new Date(wt.start),
    end: new Date(wt.end),
    userId: wt.user_id?.toString()
  }
}

const _clockFromAPI = (clock: APIClock): Clock => {
  return { id: clock.id.toString(), status: clock.status, time: new Date(clock.time) }
}

const _dexieUserFromAPI = (user: APIUser): DexieUser => {
  return { ...user, id: Number(user.id) }
}

export const adapter = {
  from: {
    api: {
      to: {
        client: {
          workingTime: _workingTimeFromAPI,
          clock: _clockFromAPI
        },
        dexie: {
          user: _dexieUserFromAPI
        }
      }
    }
  }
}
