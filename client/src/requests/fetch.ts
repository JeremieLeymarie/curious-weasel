export const authFetch = (input: RequestInfo | URL, init?: RequestInit) => {
  const User = localStorage.getItem("user")
  if (!User) 
    throw new Error("User not logged in")
  return fetch(input, { ...init, headers: { ...init?.headers, Authorization: "Bearer" + " " + JSON.parse(User).token } })
}
