import { getToken } from "next-auth/jwt"
import { NextRequest, NextResponse } from "next/server"

const API_URL = process.env.NEXT_PUBLIC_API_URL

export async function GET(req: NextRequest) {
  const token = await getToken({
    req,
    secret: process.env.AUTH_SECRET,
  })

  if (!token?.refreshToken) {
    return NextResponse.json({ error: "No refresh token" }, { status: 401 })
  }

  try {
    const res = await fetch(`${API_URL}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token: token.refreshToken }),
    })

    if (!res.ok) {
      return NextResponse.json({ error: "Refresh failed" }, { status: 401 })
    }

    const data = await res.json()
    return NextResponse.json({ accessToken: data.access_token })
  } catch {
    return NextResponse.json({ error: "Refresh failed" }, { status: 500 })
  }
}
