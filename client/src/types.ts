export type PartialId<T extends { id: string }> = Omit<T, 'id'> & { id?: string }

export type UserRole = 'general_manager' | 'manager' | 'employee'

export type User = {
  id: string
  username: string
  hash_password?: string
  email: string
  role: UserRole
  teams: Team[]
  working_times?: WorkingTime[]
}

export type SimpleUser = Pick<User, 'id' | 'username'>

export type UserWithoutId = Omit<User, 'id'>

export type WorkingTime = {
  id: string
  start: Date
  end: Date
  // userId: string
}

export type Clock = {
  id: string
  status: boolean
  time: Date
}

export type Team = {
  users?: SimpleUser[]
  manager?: SimpleUser
  id: string
  name: string
}

export type FetchRequest = {
  id: number
  input: RequestInfo | URL
  init?: RequestInit
}

export type APIUser = {
  id: number
  username: string
  hash_password?: string
  email: string
  role: UserRole
  teams: APITeam[] | null
  managed_teams: APITeam[] | null
  working_times: APIWorkingTime[] | null
  clocks: APIClock[] | null
}

export type APITeam = {
  id: number
  name: string
  users: SimpleUser[] | null
  manager: SimpleUser | null
}

export type APIClock = { id: number; status: boolean; time: string }

export type APIWorkingTime = {
  id: number
  start: string
  end: string
}

export type APITeamRequest = {
  id: number
  name: string
  user_ids: number[]
  manager_id: number
}
