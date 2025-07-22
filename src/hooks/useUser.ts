import { useSession } from 'next-auth/react';
import type { User } from '@/types';

export function useUser() {
  const { data: session, status } = useSession();

  return {
    user: session?.user as User | undefined,
    isLoading: status === 'loading',
    isAuthenticated: status === 'authenticated',
  };
}
