"use client";

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { routes } from '@/lib/routes';
import { useUser } from '@/hooks/useUser';

export default function Sidebar() {
  const pathname = usePathname();
  const { user } = useUser();

  if (!user) return null;

  const isActiveLink = (path: string) => pathname === path;

  const allowedRoutes = Object.values(routes).filter(route => 
    route.roles.includes(user.role)
  );

  return (
    <aside className="w-64 bg-white border-r border-gray-200 p-4">
      <nav className="space-y-1">
        {allowedRoutes.map(route => (
          <Link
            key={route.path}
            href={route.path}
            className={`
              flex items-center px-4 py-2 text-sm font-medium rounded-md
              ${isActiveLink(route.path)
                ? 'bg-blue-50 text-blue-600'
                : 'text-gray-600 hover:bg-gray-50'}
            `}
          >
            {/* You can add icons here later */}
            {route.path.split('/').pop()?.replace('-', ' ')}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
