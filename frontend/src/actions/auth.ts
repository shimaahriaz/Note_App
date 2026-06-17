"use server"

import { signOut } from "@/auth"
import { registerSchema } from "@/lib/validations/auth"

export async function registerAction(data: {
  email: string
  password: string
  confirmPassword: string
}): Promise<{ error: string | null }> {
  const parsed = registerSchema.safeParse(data)
  if (!parsed.success) {
    return { error: parsed.error.errors[0].message }
  }

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/register`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: parsed.data.email,
          password: parsed.data.password,
        }),
      }
    )

    if (!res.ok) {
      const err = await res.json()
      return { error: err.detail ?? "Registration failed" }
    }

    return { error: null }
  } catch {
    return { error: "Could not reach the server. Is the backend running?" }
  }
}

export async function logoutAction() {
  await signOut({ redirectTo: "/login" })
}
