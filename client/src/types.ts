export type UserRole = 'general_manager' | 'manager' | 'employee'

export type User = {
  id: string
  username: string
  hash_password?: string
  email: string
  role: UserRole
  teams: Team[]
}

export type SimpleUser = Pick<User, 'id' | 'username'>

export type UserWithoutId = Omit<User, 'id'>

export type WorkingTime = {
  id: string
  start: Date
  end: Date
  userId: string
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
  id: string
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
  id: string
  name: string
  user_ids: string[]
  manager_id: string
}

export type APIClock = { id: number; status: boolean; time: string }

export type APIWorkingTime = {
  id: number
  start: string
  end: string
  user_id: number
}
