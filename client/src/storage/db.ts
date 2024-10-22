import type { FetchRequest, SimpleUser, UserRole } from '@/types'
import Dexie, { type EntityTable } from 'dexie'

export type DexieClock = {
  id: number
  time: string
  status: boolean
}

export type DexieWorkingTime = {
  id: number
  start: string
  end: string
}

export type DexieTeam = {
  id: number
  name: string
  users: SimpleUser[] | null
  manager: SimpleUser | null
}

export type SimpleTeam = {
  id: string
  name: string
}

export type DexieUser = {
  id: number
  username: string
  email: string
  role: UserRole
  clocks?: DexieClock[] | null
  workingTimes?: DexieWorkingTime[] | null
  teams?: SimpleTeam[] | null
  managedTeams?: SimpleTeam[]
}

const db = new Dexie('time-tracker') as Dexie & {
  users: EntityTable<DexieUser, 'id'>
  workingTimes: EntityTable<DexieWorkingTime, 'id'>
  clocks: EntityTable<DexieClock, 'id'>
  teams: EntityTable<DexieTeam, 'id'>
  requests: EntityTable<FetchRequest, 'id'>
}

db.version(1).stores({
  users: 'id',
  workingTimes: 'id',
  clocks: 'id',
  teams: 'id',
  requests: 'id++'
})

export { db }
