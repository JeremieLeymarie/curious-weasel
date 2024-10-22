import type { DexieTeam, DexieUser, DexieWorkingTime } from './storage/db'
import type {
  APIClock,
  APITeam,
  APIUser,
  APIWorkingTime,
  Clock,
  Team,
  User,
  WorkingTime
} from './types'

const _workingTimeFromAPI = (wt: APIWorkingTime): WorkingTime => {
  return {
    id: wt.id.toString(),
    start: new Date(wt.start),
    end: new Date(wt.end)
  }
}

const _workingTimeFromDexie = (wt: DexieWorkingTime): WorkingTime => {
  return { ...wt, start: new Date(wt.start), end: new Date(wt.end) }
}

const _clockFromAPI = (clock: APIClock): Clock => {
  return { id: clock.id.toString(), status: clock.status, time: new Date(clock.time) }
}

const _userFromAPI = (user: APIUser): User => {
  return { ...user, teams: user.teams ? user.teams.map(_teamFromAPI) : [] }
}

const _userFromDexie = (user: DexieUser): User => {
  return { ...user, teams: user.teams ?? [] }
}

const _teamFromDexie = (team: DexieTeam): Team => {
  return { ...team, users: team.users ?? undefined, manager: team.manager ?? undefined }
}

const _teamFromAPI = (team: APITeam): Team => {
  return { ...team, users: team.users ?? undefined, manager: team.manager ?? undefined }
}

export const adapter = {
  from: {
    api: {
      to: {
        client: {
          workingTime: _workingTimeFromAPI,
          clock: _clockFromAPI,
          user: _userFromAPI,
          team: _teamFromAPI
        },
        dexie: {}
      }
    },
    dexie: {
      to: {
        client: {
          user: _userFromDexie,
          team: _teamFromDexie,
          workingTime: _workingTimeFromDexie
        }
      }
    }
  }
}
