import type { SimpleUser, UserRole } from '@/types'
import Dexie, { type EntityTable } from 'dexie'
import { nanoid } from 'nanoid'

export const getTmpId = () => `tmp-${nanoid()}`

export type DexieClock = {
  id: string
  time: string
  status: boolean
}

export type DexieWorkingTime = {
  id: string
  start: string
  end: string
  userId?: string
  teamId?: string
}

export type DexieTeam = {
  id: string
  name: string
  users?: SimpleUser[] | null
  manager?: SimpleUser | null
}

export type SimpleTeam = {
  id: string
  name: string
}

export type DexieUser = {
  id: string
  username: string
  email: string
  role: UserRole
  clocks?: DexieClock[] | null
  workingTimes?: DexieWorkingTime[] | null
  teams?: SimpleTeam[] | null
  managedTeams?: SimpleTeam[]
}

export type RecordCreate = {
  id: string
  url: string
  body: Record<string, unknown>
}

export type RecordUpdate = {
  id: number
  url: string
  body: Record<string, unknown>
}

export type RecordDelete = {
  id: number
  url: string
}

const db = new Dexie('time-tracker') as Dexie & {
  users: EntityTable<DexieUser, 'id'>
  workingTimes: EntityTable<DexieWorkingTime, 'id'>
  clocks: EntityTable<DexieClock, 'id'>
  teams: EntityTable<DexieTeam, 'id'>
  recordCreates: EntityTable<RecordCreate, 'id'>
  recordUpdates: EntityTable<RecordUpdate, 'id'>
  recordDeletes: EntityTable<RecordDelete, 'id'>
}

db.version(1).stores({
  users: 'id',
  workingTimes: 'id',
  clocks: 'id',
  teams: 'id',
  recordCreates: 'id++',
  recordUpdates: 'id++',
  recordDeletes: 'id++'
})

export { db }
