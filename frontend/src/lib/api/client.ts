import axios from "axios"
import { getSession } from "next-auth/react"
import { toast } from "sonner"

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 10_000,
})

apiClient.interceptors.request.use(async (config) => {
  const session = await getSession()
  if (session?.accessToken) {
    config.headers.Authorization = `Bearer ${session.accessToken}`
  }
  return config
})

let isRefreshing = false
let pendingRequests: Array<(token: string) => void> = []

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config

    if (error.response?.status === 401 && !original._retry) {
      original._retry = true

      if (isRefreshing) {
        return new Promise((resolve) => {
          pendingRequests.push((token) => {
            original.headers.Authorization = `Bearer ${token}`
            resolve(apiClient(original))
          })
        })
      }

      isRefreshing = true

      try {
        const res = await fetch("/api/auth/refresh")
        if (!res.ok) throw new Error("Refresh failed")
        const { accessToken } = await res.json()

        pendingRequests.forEach((cb) => cb(accessToken))
        pendingRequests = []
        original.headers.Authorization = `Bearer ${accessToken}`
        return apiClient(original)
      } catch {
        pendingRequests = []
        window.location.href = "/login"
        return Promise.reject(error)
      } finally {
        isRefreshing = false
      }
    }

    const message =
      error.response?.data?.detail ?? error.message ?? "Something went wrong"
    toast.error(message)
    return Promise.reject(new Error(message))
  }
)
