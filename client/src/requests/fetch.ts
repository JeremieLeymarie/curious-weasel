import { Network } from '@capacitor/network'

export const isOffline = async () => {
  const status = await Network.getStatus()
  return true // TODO: remvoe this line
  return !status.connected
}

export const fetcher = async (input: RequestInfo | URL, init?: RequestInit) => {
  const user = localStorage.getItem('user')
  if (!user) throw new Error('User not logged in')

  const token = JSON.parse(user).token

  // if (await isOffline()) {
  //   // All mutations are stored to be re-executed when network is available
  //   if (init?.method && init.method !== 'GET') {
  //     // TODO: store mutations in DB
  //   }
  //   return null
  // }

  return fetch(input, {
    ...init,
    headers: { ...init?.headers, Authorization: `Bearer ${token}` }
  })
}
