import { db } from '@/storage/db'
import { Network } from '@capacitor/network'

export const isOffline = async () => {
  const status = await Network.getStatus()
  // return true // TODO: remove this line
  return !status.connected
}

export const fetcher = async (input: RequestInfo | URL, init?: RequestInit) => {
  const user = localStorage.getItem('user')
  if (!user) throw new Error('User not logged in')

  const token = JSON.parse(user).token

  const requestOptions = {
    ...init,
    headers: { ...init?.headers, Authorization: `Bearer ${token}` }
  }

  return fetch(input, requestOptions)
}

const FAKE_SYNCHRONIZATION_DELAY = 500 // in ms

export const synchronizeMutations = async () => {
  if (await isOffline()) return null

  const createRequests = await db.recordCreates.toArray()
  const updateRequests = await db.recordUpdates.toArray()

  if (!createRequests.length && !updateRequests.length) return null

  // Prepare all fetch requests (PUT && POST)
  const postRequests = createRequests.map(({ body, url }) =>
    fetcher(url, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json'
      }
    })
  )

  const putRequests = updateRequests.map(({ body, url }) =>
    fetcher(url, {
      method: 'PUT',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json'
      }
    })
  )

  // Fetch everything
  const responses = await Promise.all([...postRequests, putRequests])

  // Clear unsynchronized requests
  await db.recordCreates.clear()
  await db.recordUpdates.clear()

  await new Promise((res) => setTimeout(res, FAKE_SYNCHRONIZATION_DELAY))

  return responses
}

export const addCreateRecord = async (
  url: string,
  tmpId: string,
  record: Record<string, unknown>
) => {
  await db.recordCreates.add({ id: tmpId, body: record, url })
}

export const addUpdateRecord = async (url: string, id: string, record: Record<string, unknown>) => {
  const recordOnlyExistsLocally = id.startsWith('tmp-')

  const creationRecord = await db.recordCreates.get(id)

  // If record exists only in local database, don't register update request, only modify existing POST unsynchronized payload
  if (recordOnlyExistsLocally && creationRecord) {
    return await db.recordCreates.update(id, { body: { ...creationRecord.body, ...record } })
  }

  await db.recordUpdates.add({ url, body: record })
}
