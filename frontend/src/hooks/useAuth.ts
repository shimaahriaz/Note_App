"use client"

import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"

export function useAuth() {
  const { data: session, status } = useSession()
  const router = useRouter()

  const isLoading = status === "loading"
  const isAuthenticated = status === "authenticated"
  const user = session?.user

  async function logout() {
    await signOut({ redirect: false })
    router.push("/login")
  }

  return {
    user,
    isLoading,
    isAuthenticated,
    logout,
  }
}