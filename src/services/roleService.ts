import apiClient from "@/lib/api-client/api-client";
import { Role } from "@/types/user";

export async function getRoles(): Promise<Role[]> {
    const response = await apiClient.get('/api/roles');
    return response.data;
}
