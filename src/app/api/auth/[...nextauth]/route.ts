// src/app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth"
import { authConfig } from "@/lib/auth/auth.config"

const handler = NextAuth(authConfig)

export const { GET, POST } = handler
