import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'

export const { handlers: { GET, POST }, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        if (credentials.email === "admin@example.com" && credentials.password === "admin123") {
          return {
            id: "1",
            email: credentials.email,
            name: "Admin"
          }
        }

        return null
      }
    })
  ],
  pages: {
    signIn: '/login'
  }
})
