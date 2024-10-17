export const authFetch = (input: RequestInfo | URL, init?: RequestInit) => {
  return fetch(input, { ...init, headers: { ...init?.headers } })
}
