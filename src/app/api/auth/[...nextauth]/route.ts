<<<<<<< HEAD
import { handlers } from "@/auth"

export const { GET, POST } = handlers
=======
// app/api/auth/[...nextauth]/route.ts
import NextAuth, { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import axios from "axios"

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        console.log("email: ", credentials?.email)
        if (!credentials?.email || !credentials?.password) {
          console.log("Missing credentials")
          return null
        }

        console.log("Attempting login with:", credentials.email)

        try {
          // Check if BASE_URL is configured
          if (!process.env.BASE_URL) {
            console.error("BASE_URL not configured")
            return null
          }

          console.log("Calling API:", process.env.BASE_URL + "/api/auth/login")
          
          const res = await axios.post(process.env.BASE_URL + "/api/auth/login", {
            email: credentials.email,
            password: credentials.password,
          })

          console.log("API response:", res.status, res.data)

          const data = res.data
          if (res.status === 200 && data?.id && data?.email) {
            return {
              id: String(data.id),
              email: data.email,
              accessToken: data.accessToken,
              firstName: data.profile?.firstName,
              lastName: data.profile?.lastName,
              name: data.profile?.firstName+" "+data.profile?.lastName || data.email,
              roles: data.roles,
            }
          }

          console.log("API returned invalid data")
          return null
        } catch (error: any) {
          console.error("Login failed:", error.response?.status, error.response?.data || error.message)
          return null
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      // Khi user login lần đầu, ghi đè token
      if (user) {
        token.accessToken = user.accessToken;
        token.roles = user.roles;
        token.profile = user.profile;
        token.id = user.id;
        token.email = user.email;
      }

      return token;
    },

    async session({ session, token }) {
      session.accessToken = token.accessToken;
      session.user = {
        id: token.id,
        email: token.email,
        profile: token.profile,
        roles: token.roles,
      };

      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
>>>>>>> d1d89456fef6613b064af36789695f7d8f213495
