'use client'

import Link from 'next/link'
import { signOut } from 'next-auth/react'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/Button'

export default function Header() {
  const pathname = usePathname()

  return (
    <header className="h-16 border-b bg-white">
      <div className="container mx-auto px-6 h-full">
        <div className="flex items-center justify-between h-full">
          <div className="flex items-center gap-6">
            <Link href="/dashboard" className="text-xl font-bold">
              TaskManager
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => signOut({ callbackUrl: '/login' })}
            >
              Sign out
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
