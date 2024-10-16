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
