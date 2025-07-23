import { PrismaAdapter } from "@auth/prisma-adapter"
import { DefaultSession, NextAuthConfig } from "next-auth"
import { db } from "@/lib/db"
import Credentials from "next-auth/providers/credentials"
import { Role } from "@/types"
import { getDefaultRouteForRole } from "@/lib/routes"

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string
      role: Role
    } & DefaultSession["user"]
  }
}

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub
      }
      if (token.role && session.user) {
        session.user.role = token.role as Role
      }
      return session
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
      }
      return token
    },
    async authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard')
      
      if (isOnDashboard) {
        if (isLoggedIn) {
          // Check role-based access
          const userRole = auth.user.role as Role
          const path = nextUrl.pathname
          const hasPermission = false // Implement your role check here
          
          if (!hasPermission) {
            // Redirect to default route for role
            const redirectUrl = new URL(getDefaultRouteForRole(userRole), nextUrl)
            return Response.redirect(redirectUrl)
          }
          return true
        }
        return false // Redirect to login
      }
      
      return true
    }
  },
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        // This is where you would typically check against your database
        if (credentials.email === "admin@example.com" && credentials.password === "admin123") {
          return {
            id: "1",
            name: "Admin User",
            email: credentials.email,
            role: "owner" as Role,
          }
        }

        return null
      },
    }),
  ],
} satisfies NextAuthConfig
