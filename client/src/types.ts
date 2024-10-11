export type UserRole = 'general_manager' | 'manager' | 'employee'

export type User = {
  id: string
  username: string
  password?: string
  email: string
  role: UserRole
}

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
