export type User = {
  id: string
  username: string
  email: string
}

export type UserWithoutId = Omit<User, 'id'>
