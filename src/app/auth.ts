import NextAuth from 'next-auth'
import { type NextAuthConfig } from 'next-auth'
import { authConfig } from './auth.config'

const { auth, signIn, signOut } = NextAuth(authConfig)

export { auth, signIn, signOut }
