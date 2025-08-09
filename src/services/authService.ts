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

// Cookie utility functions
const setCookie = (name: string, value: string, options: {
  httpOnly?: boolean;
  secure?: boolean;
  sameSite?: 'strict' | 'lax' | 'none';
  maxAge?: number;
  path?: string;
} = {}) => {
  const {
    httpOnly = true,
    secure = true,
    sameSite = 'strict',
    maxAge,
    path = '/'
  } = options;

  let cookieString = `${name}=${value}; Path=${path}; SameSite=${sameSite}`;
  
  if (secure) cookieString += '; Secure';
  if (httpOnly) cookieString += '; HttpOnly';
  if (maxAge) cookieString += `; Max-Age=${maxAge}`;

  // For client-side, we can't set httpOnly cookies directly
  // We'll need to make API calls to set these cookies server-side
  if (typeof window !== 'undefined' && !httpOnly) {
    document.cookie = cookieString;
  }
  
  return cookieString;
};

const getCookie = (name: string): string | null => {
  if (typeof window === 'undefined') return null;
  
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop()?.split(';').shift() || null;
  }
  return null;
};

const deleteCookie = (name: string, path: string = '/') => {
  if (typeof window !== 'undefined') {
    document.cookie = `${name}=; Path=${path}; Expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=strict; Secure`;
  }
};

export const authService = {
  // Set authentication cookies via API call
  setAuthCookies: async (accessToken: string, refreshToken: string, expiresIn: number): Promise<void> => {
    try {
      await api.post('/auth/set-cookies', {
        accessToken,
        refreshToken,
        expiresIn
      });
    } catch (error) {
      // If backend is not available, we can't set httpOnly cookies
      // For now, we'll continue without them (tokens are still parsed for user info)
      console.warn('Backend not available for setting cookies, continuing without httpOnly cookies:', error);
    }
  },

  // Google OAuth login
  loginWithGoogle: async (authorizationCode: string): Promise<GoogleAuthResponse> => {
    const response = await api.post<GoogleAuthResponse>('/auth/google', {
      code: authorizationCode,
      redirectUri: `${window.location.origin}/auth/callback`
    });
    
    const { accessToken, refreshToken, expiresIn } = response.data;
    
    // Set cookies via API call (httpOnly, secure)
    await authService.setAuthCookies(accessToken, refreshToken, expiresIn);
    
    return response.data;
  },

  // Get current user
  getCurrentUser: async (): Promise<UserWithRole> => {
    const response = await api.get<UserWithRole>('/auth/me');
    return response.data;
  },

  // Refresh token via API call (cookies handled server-side)
  refreshToken: async (): Promise<AuthTokens> => {
    const response = await api.post<AuthTokens>('/auth/refresh');
    
    // Cookies are updated server-side automatically
    return response.data;
  },

  // Logout and clear cookies
  logout: async (): Promise<void> => {
    try {
      // Call backend logout endpoint (clears httpOnly cookies server-side)
      // Only if backend is available
      await api.post('/auth/logout');
    } catch (error) {
      // If backend is not available or returns error, continue with client-side cleanup
      console.warn('Backend logout failed, continuing with client-side cleanup:', error);
    } finally {
      // Always clear client-side data
      deleteCookie('user_info');
      deleteCookie('auth_state');
      
      // Clear user data from localStorage (non-sensitive data)
      if (typeof window !== 'undefined') {
        localStorage.removeItem('userInfo');
      }
    }
  },

  // Check if token is expired (via API call since we can't access httpOnly cookies)
  isTokenExpired: async (): Promise<boolean> => {
    try {
      const response = await api.get('/auth/validate');
      // @ts-ignore
      return !response.data.valid;
    } catch (error) {
      // If backend is not available, check if we have user info as fallback
      const userInfo = authService.getUserInfo();
      return !userInfo;
    }
  },

  // Get stored access token (not available with httpOnly cookies)
  getAccessToken: (): string | null => {
    // With httpOnly cookies, we can't access the token directly
    // The token is automatically sent with requests via cookies
    return null;
  },

  // Check if user is authenticated (via API call or fallback to user info)
  isAuthenticated: async (): Promise<boolean> => {
    try {
      const response = await api.get('/auth/validate');
      // @ts-ignore
      return response.data.valid;
    } catch (error) {
      // If backend is not available, check if we have user info as fallback
      const userInfo = authService.getUserInfo();
      return !!userInfo;
    }
  },

  // Store user info in non-httpOnly cookie for client-side access
  setUserInfo: (userInfo: any): void => {
    if (typeof window !== 'undefined') {
      // Store user info in localStorage for client-side access (non-sensitive data)
      localStorage.setItem('userInfo', JSON.stringify(userInfo));
      
      // Also set a non-httpOnly cookie for easier access
      setCookie('user_info', JSON.stringify(userInfo), {
        httpOnly: false,
        maxAge: 7 * 24 * 60 * 60, // 7 days
        secure: true,
        sameSite: 'strict'
      });
    }
  },

  // Get user info from localStorage or cookie
  getUserInfo: (): any | null => {
    if (typeof window === 'undefined') return null;
    
    try {
      // Try localStorage first
      const userInfo = localStorage.getItem('userInfo');
      if (userInfo) {
        return JSON.parse(userInfo);
      }
      
      // Fallback to cookie
      const cookieUserInfo = getCookie('user_info');
      if (cookieUserInfo) {
        return JSON.parse(cookieUserInfo);
      }
      
      return null;
    } catch (error) {
      console.error('Error parsing user info:', error);
      return null;
    }
  }
};