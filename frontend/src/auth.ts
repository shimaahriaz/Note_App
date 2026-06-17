import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"
import { loginSchema } from "@/lib/validations/auth"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),

    Credentials({
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials)
        if (!parsed.success) return null

        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(parsed.data),
            }
          )

          if (!res.ok) return null

          const tokens = await res.json()

          return {
            email: parsed.data.email,
            accessToken: tokens.access_token,
            refreshToken: tokens.refresh_token,
          }
        } catch {
          return null
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user, account }) {
      // ❶ Credentials login
      if (user?.accessToken) {
        token.accessToken = user.accessToken
        token.refreshToken = user.refreshToken
      }

      if (account?.provider === "google") {
        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/auth/google`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                email: token.email,
                google_id: account.providerAccountId,
              }),
            }
          )

          if (res.ok) {
            const tokens = await res.json()
            token.accessToken = tokens.access_token
            token.refreshToken = tokens.refresh_token
          }
        } catch {
          return token
        }
      }

      return token
    },

    async session({ session, token }) {
      session.accessToken = token.accessToken as string
      return session
    },
  },

  pages: {
    signIn: "/login",
  },
})