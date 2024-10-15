export type UserRole = 'general_manager' | 'manager' | 'employee'

export type User = {
  Daily: any
  weekly: any
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

export type Team = {
  users?: { id: string; username: string }[]
  id: string
  name: string
  manager?: User
}
