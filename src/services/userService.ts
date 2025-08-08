import apiClient from "@/lib/api-client/api-client";
import { UserProfile, UserRegister } from "@/types/user";
import { User } from "@/types/user";

export async function createUser(user: UserRegister): Promise<User> {
    const response = await apiClient.post('/api/users', user);
    return response.data;
}

export async function updateUser(user: UserProfile): Promise<User> {
    const response = await apiClient.put(`/users/${user.id}`, user);
    return response.data;
}
