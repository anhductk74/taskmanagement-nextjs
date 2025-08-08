// Real Auth Service - Spring Boot + JWT + Google OAuth
import { api } from './api';
import type { User, UserWithRole } from '@/types/roles';

interface GoogleAuthResponse {
  user: UserWithRole;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export const authService = {
  // Google OAuth login
  loginWithGoogle: async (authorizationCode: string): Promise<GoogleAuthResponse> => {
    const response = await api.post<GoogleAuthResponse>('/auth/google', {
      code: authorizationCode,
      redirectUri: `${window.location.origin}/auth/callback`
    });
    
    const { accessToken, refreshToken } = response.data;
    
    // Store tokens in both localStorage and cookies
    localStorage.setItem('access_token', accessToken);
    localStorage.setItem('refresh_token', refreshToken);
    localStorage.setItem('token_expires_at', 
      (Date.now() + response.data.expiresIn * 1000).toString()
    );
    
    // Set cookies for SSR
    document.cookie = `token=${accessToken}; path=/; max-age=${response.data.expiresIn}`;
    document.cookie = `refreshToken=${refreshToken}; path=/; max-age=${response.data.expiresIn * 2}`;
    document.cookie = `userId=${response.data.user.id}; path=/; max-age=${response.data.expiresIn}`;
    document.cookie = `userRole=${response.data.user.role}; path=/; max-age=${response.data.expiresIn}`;
    
    return response.data;
  },

  // Get current user
  getCurrentUser: async (): Promise<UserWithRole> => {
    const response = await api.get<UserWithRole>('/auth/me');
    return response.data;
  },

  // Refresh token
  refreshToken: async (): Promise<AuthTokens> => {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await api.post<AuthTokens>('/auth/refresh', {
      refreshToken
    });

    const { accessToken, refreshToken: newRefreshToken, expiresIn } = response.data;
    
    // Update stored tokens
    localStorage.setItem('access_token', accessToken);
    localStorage.setItem('refresh_token', newRefreshToken);
    localStorage.setItem('token_expires_at', 
      (Date.now() + expiresIn * 1000).toString()
    );

    return response.data;
  },

  // Logout
  logout: async (): Promise<void> => {
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken) {
        await api.post('/auth/logout', { refreshToken });
      }
    } finally {
      // Clear local storage
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('token_expires_at');
      
      // Clear cookies
      document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
      document.cookie = 'refreshToken=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
      document.cookie = 'userId=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
      document.cookie = 'userRole=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
    }
  },

  // Check if token is expired
  isTokenExpired: (): boolean => {
    const expiresAt = localStorage.getItem('token_expires_at');
    if (!expiresAt) return true;
    
    return Date.now() >= parseInt(expiresAt);
  },

  // Get stored access token
  getAccessToken: (): string | null => {
    return localStorage.getItem('access_token');
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    const token = authService.getAccessToken();
    return token !== null && !authService.isTokenExpired();
  }
};