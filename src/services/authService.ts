// Real Auth Service - Spring Boot + JWT + Google OAuth with HttpOnly Secure Cookies
import { api } from './api';
import type { User, UserWithRole } from '@/types/roles';

interface GoogleAuthResponse {
  user: UserWithRole;
  // Tokens are now handled via HttpOnly cookies, not returned in response
  success: boolean;
}

interface AuthTokens {
  success: boolean;
  // Tokens are now handled via HttpOnly cookies
}

export const authService = {
  // Google OAuth login
  loginWithGoogle: async (authorizationCode: string): Promise<GoogleAuthResponse> => {
    const response = await api.post<GoogleAuthResponse>('/auth/google', {
      code: authorizationCode,
      redirectUri: `${window.location.origin}/auth/callback`
    }, {
      // Ensure cookies are included in requests
      withCredentials: true
    });
    
<<<<<<< HEAD
    // Tokens are now automatically stored in HttpOnly Secure cookies by the server
    // No client-side token storage needed
=======
    const { accessToken, refreshToken } = response.data;
    
<<<<<<< HEAD
    // Store tokens
=======
    // Store tokens in both localStorage and cookies
>>>>>>> origin/anhduc
    localStorage.setItem('access_token', accessToken);
    localStorage.setItem('refresh_token', refreshToken);
    localStorage.setItem('token_expires_at', 
      (Date.now() + response.data.expiresIn * 1000).toString()
    );
>>>>>>> d1d89456fef6613b064af36789695f7d8f213495
    
<<<<<<< HEAD
=======
    // Set cookies for SSR
    document.cookie = `token=${accessToken}; path=/; max-age=${response.data.expiresIn}`;
    document.cookie = `refreshToken=${refreshToken}; path=/; max-age=${response.data.expiresIn * 2}`;
    document.cookie = `userId=${response.data.user.id}; path=/; max-age=${response.data.expiresIn}`;
    document.cookie = `userRole=${response.data.user.role}; path=/; max-age=${response.data.expiresIn}`;
    
>>>>>>> origin/anhduc
    return response.data;
  },

  // Get current user
  getCurrentUser: async (): Promise<UserWithRole> => {
    const response = await api.get<UserWithRole>('/auth/me', {
      // Ensure cookies are included in requests
      withCredentials: true
    });
    return response.data;
  },

  // Refresh token
  refreshToken: async (): Promise<AuthTokens> => {
    // Refresh token is automatically sent via HttpOnly cookie
    const response = await api.post<AuthTokens>('/auth/refresh', {}, {
      // Ensure cookies are included in requests
      withCredentials: true
    });

    // New tokens are automatically stored in HttpOnly Secure cookies by the server
    // No client-side token storage needed

    return response.data;
  },

  // Logout
  logout: async (): Promise<void> => {
<<<<<<< HEAD
    // Send logout request - server will clear HttpOnly cookies
    await api.post('/auth/logout', {}, {
      withCredentials: true
    });
    // HttpOnly cookies are automatically cleared by the server
    // No client-side storage to clear
=======
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken) {
        await api.post('/auth/logout', { refreshToken });
      }
    } finally {
<<<<<<< HEAD
      // Always clear local storage
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('token_expires_at');
=======
      // Clear local storage
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('token_expires_at');
      
      // Clear cookies
      document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
      document.cookie = 'refreshToken=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
      document.cookie = 'userId=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
      document.cookie = 'userRole=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
>>>>>>> origin/anhduc
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
>>>>>>> d1d89456fef6613b064af36789695f7d8f213495
  },

  // Check if user is authenticated
  isAuthenticated: async (): Promise<boolean> => {
    try {
      // Check authentication status by calling a protected endpoint
      await api.get('/auth/verify', {
        withCredentials: true
      });
      return true;
    } catch (error) {
      return false;
    }
  },

  // Verify authentication status (synchronous check for initial load)
  hasValidSession: (): boolean => {
    // Since we can't access HttpOnly cookies from JavaScript,
    // we need to rely on server-side verification
    // This method is mainly for initial state - use isAuthenticated() for actual checks
    return true; // Will be verified by server on first API call
  }
};