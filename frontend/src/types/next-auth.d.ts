import "next-auth"
import "next-auth/jwt"

// ❶ بنضيف الـ accessToken للـ session عشان TypeScript يعرفه
declare module "next-auth" {
  interface Session {
    accessToken?: string
  }
  interface User {
    accessToken?: string
    refreshToken?: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string
    refreshToken?: string
  }
}