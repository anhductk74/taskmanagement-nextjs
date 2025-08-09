"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/authService';

export default function AuthCallbackPage() {
  const router = useRouter();
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const handleGoogleCallback = async () => {
      try {
        // Extract tokens from URL params (as per FRONTEND_INTEGRATION_GUIDE.md)
        const urlParams = new URLSearchParams(window.location.search);
        
        const accessToken = urlParams.get('access_token');
        const refreshToken = urlParams.get('refresh_token');
        const userId = urlParams.get('user_id');
        const email = urlParams.get('email');
        const firstName = urlParams.get('first_name');
        const lastName = urlParams.get('last_name');
        const avatarUrl = urlParams.get('avatar_url');
        const isFirstLogin = urlParams.get('is_first_login');
        const expiresIn = urlParams.get('expires_in');
        const tokenType = urlParams.get('token_type');

        console.log('🔐 Auth Callback Data:', {
          accessToken: accessToken ? 'Present' : 'Missing',
          refreshToken: refreshToken ? 'Present' : 'Missing',
          userId,
          email,
          firstName: decodeURIComponent(firstName || ''),
          lastName: decodeURIComponent(lastName || ''),
          avatarUrl: decodeURIComponent(avatarUrl || ''),
          isFirstLogin,
          expiresIn,
          tokenType
        });

        if (!accessToken || !refreshToken) {
          throw new Error('Missing required tokens in callback URL');
        }

        // Set secure httpOnly cookies via API call
        await authService.setAuthCookies(
          accessToken, 
          refreshToken, 
          parseInt(expiresIn || '3600')
        );
        
        // Decode JWT token to get roles from backend
        let roles = [];
        try {
          const payload = JSON.parse(atob(accessToken.split('.')[1]));
          roles = payload.roles || []; // Backend sets roles in JWT token
          console.log('🔑 Roles from JWT token:', roles);
        } catch (error) {
          console.error('Error parsing JWT token for roles:', error);
          roles = ['MEMBER']; // Default fallback
        }

        // Store user info (non-sensitive data) using authService
        const userInfo = {
          id: userId,
          email: decodeURIComponent(email || ''),
          firstName: decodeURIComponent(firstName || ''),
          lastName: decodeURIComponent(lastName || ''),
          avatarUrl: decodeURIComponent(avatarUrl || ''),
          isFirstLogin: isFirstLogin === 'true',
          roles: roles // Roles from backend JWT token
        };
        
        // Use authService to store user info in both localStorage and cookie
        authService.setUserInfo(userInfo);
        
        setStatus('success');
        
        // Redirect to dashboard after successful auth
        setTimeout(() => {
          router.push('/home');
        }, 1500);
        
      } catch (err) {
        console.error('Auth callback error:', err);
        setError(err instanceof Error ? err.message : 'Authentication failed');
        setStatus('error');
        
        // Redirect to login after error
        setTimeout(() => {
          router.push('/login');
        }, 3000);
      }
    };

    handleGoogleCallback();
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="max-w-md w-full bg-gray-800 rounded-lg p-8 text-center">
        {status === 'processing' && (
          <>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-white mb-2">Processing Authentication...</h2>
            <p className="text-gray-400">Please wait while we complete your login.</p>
          </>
        )}
        
        {status === 'success' && (
          <>
            <div className="text-green-500 mb-4">
              <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">Login Successful!</h2>
            <p className="text-gray-400">Redirecting to dashboard...</p>
          </>
        )}
        
        {status === 'error' && (
          <>
            <div className="text-red-500 mb-4">
              <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">Authentication Failed</h2>
            <p className="text-gray-400 mb-4">{error}</p>
            <p className="text-sm text-gray-500">Redirecting to login page...</p>
          </>
        )}
      </div>
    </div>
  );
}