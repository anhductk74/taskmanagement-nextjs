import apiClient, { buildClientAuthHeaders } from "@/lib/api-client/api-client";
import { UserProfile, UserRegister } from "@/types/user";
import { User } from "@/types/user";

export async function createUser(user: UserRegister): Promise<User> {
  // Call Next.js API route (same-origin) to avoid CORS; the route will proxy to backend
  
  const res = await fetch('/api/users', {
    method: 'POST',
    headers: await buildClientAuthHeaders(),
    body: JSON.stringify(user),
  });

  if (!res.ok) {
    const errorBody = await res.text().catch(() => '');
    throw new Error(`Create user failed: ${res.status} ${errorBody}`);
  } 

  return (await res.json()) as User;
}

export async function updateUser(user: UserProfile): Promise<User> {
    const response = await apiClient.put(`/users/${user.id}`, user);
    return response.data;
}


