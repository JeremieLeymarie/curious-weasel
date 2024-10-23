import type { DexieClock, DexieTeam, DexieUser, DexieWorkingTime } from './storage/db'
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

// WORKING TIME ADAPTERS

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

const _dexieWorkingTimeFromAPI = (
  wt: APIWorkingTime,
  additionalData: { userId?: string; teamId?: string }
): DexieWorkingTime => {
  return { ...wt, ...additionalData, id: wt.id.toString() }
}

// CLOCK ADAPTERS

const _clockFromAPI = (clock: APIClock): Clock => {
  return { id: clock.id.toString(), status: clock.status, time: new Date(clock.time) }
}

const _clockFromDexie = (clock: DexieClock): Clock => {
  return { id: clock.id.toString(), status: clock.status, time: new Date(clock.time) }
}

const _dexieClockFromAPI = (clock: APIClock): DexieClock => {
  return { ...clock, id: clock.id.toString() }
}

// USER ADAPTERS

const _userFromAPI = (user: APIUser): User => {
  return { ...user, teams: user.teams ? user.teams.map(_teamFromAPI) : [], id: user.id.toString() }
}

const _userFromDexie = (user: DexieUser): User => {
  return { ...user, teams: user?.teams ?? [] }
}

const _dexieUserFromAPI = (user: APIUser): DexieUser => {
  return {
    ...user,
    id: user.id.toString(),
    clocks: user.clocks?.map(_dexieClockFromAPI),
    teams: user.teams?.map(_dexieTeamFromAPI),
    managedTeams: user.managed_teams?.map(_dexieTeamFromAPI)
  }
}

// TEAM ADAPTERS

const _teamFromDexie = (team: DexieTeam): Team => {
  return { ...team, users: team.users ?? undefined, manager: team.manager ?? undefined }
}

const _teamFromAPI = (team: APITeam): Team => {
  return {
    ...team,
    users: team.users ?? undefined,
    manager: team.manager ?? undefined,
    id: team.id.toString()
  }
}

const _dexieTeamFromAPI = (team: APITeam): DexieTeam => {
  return { ...team, id: team.id.toString() }
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
        dexie: {
          workingTime: _dexieWorkingTimeFromAPI,
          clock: _dexieClockFromAPI,
          user: _dexieUserFromAPI,
          team: _dexieTeamFromAPI
        }
      }
    },
    dexie: {
      to: {
        client: {
          user: _userFromDexie,
          team: _teamFromDexie,
          workingTime: _workingTimeFromDexie,
          clock: _clockFromDexie
        }
      }
    }
  }
}
