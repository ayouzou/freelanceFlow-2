import { useQuery } from "@tanstack/react-query"

interface User {
  id: string
  name: string
  email: string
  role: string
}

async function getCurrentUser(): Promise<User | null> {
  try {
    const response = await fetch("/api/auth/me")

    if (!response.ok) {
      return null
    }

    return response.json()
  } catch (error) {
    console.error("Error fetching current user:", error)
    return null
  }
}

export function useCurrentUser() {
  return useQuery({
    queryKey: ["user"],
    queryFn: getCurrentUser,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}