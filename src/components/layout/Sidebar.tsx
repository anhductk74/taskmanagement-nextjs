'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const routes = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: '📊'
  },
  {
    label: 'Tasks',
    href: '/dashboard/tasks',
    icon: '✓'
  },
  {
    label: 'Projects',
    href: '/dashboard/projects',
    icon: '📁'
  },
  {
    label: 'Team',
    href: '/dashboard/team',
    icon: '👥'
  },
  {
    label: 'Settings',
    href: '/dashboard/settings',
    icon: '⚙️'
  }
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="w-64 border-r bg-white">
      <div className="p-6">
        <nav className="space-y-2">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                'flex items-center gap-2 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100',
                pathname === route.href && 'bg-gray-100 text-gray-900'
              )}
            >
              <span>{route.icon}</span>
              {route.label}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  )
}
