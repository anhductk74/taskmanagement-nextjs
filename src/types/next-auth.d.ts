import NextAuth from "next-auth"
import { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    accessToken?: string
    user: {
      id?: string
      email?: string | null
      profile?: {
        firstName?: string | null
        lastName?: string | null
        avtUrl?: string | null
      }
      roles?: string[] // hoặc any[] nếu cần
    }
  }

  interface User {
    id?: string
    email?: string | null
    accessToken?: string
    roles?: string[]
    profile?: {
      firstName?: string | null
      lastName?: string | null
      avtUrl?: string | null
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string
    roles?: string[]
    id?: string
    email?: string | null
    profile?: {
      firstName?: string | null
      lastName?: string | null
      avtUrl?: string | null
    }
  }
}
