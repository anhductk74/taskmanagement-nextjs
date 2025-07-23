import { auth } from '@/app/api/auth/[...nextauth]/route';

export type AuthUser = {
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role?: string;
} | undefined;

export async function getUser(): Promise<AuthUser> {
  const session = await auth();
  return session?.user;
}
