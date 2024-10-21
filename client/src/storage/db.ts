import type { FetchRequest, Clock, Team, User, WorkingTime } from '@/types'
import Dexie, { type EntityTable } from 'dexie'

const db = new Dexie('time-tracker') as Dexie & {
  users: EntityTable<User, 'id'>
  workingTimes: EntityTable<WorkingTime, 'id'>
  clocks: EntityTable<Clock, 'id'>
  teams: EntityTable<Team, 'id'>
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
