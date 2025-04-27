//C:\VSProjects\bndy-landing\src\app\auth\logout\page.tsx
'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { AuthProvider, useAuth } from 'bndy-ui';

// Separate the content into its own component that uses the hook
function LogoutContent() {
  const searchParams = useSearchParams();
  const { signOut } = useAuth();
  
  useEffect(() => {
    const processLogout = async () => {
      // Get return URL if any
      const returnTo = searchParams.get('returnTo');
      
      // Sign out from Firebase
      await signOut();
      
      // No need to manually clear local storage, signOut handles it
      // localStorage.removeItem('bndyAuthToken');
      
      // Redirect back to the return URL if provided
      if (returnTo) {
        window.location.href = returnTo;
      } else {
        // Default to home page
        window.location.href = '/';
      }
    };
    
    processLogout();
  }, [searchParams, signOut]);
  
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-slate-900 p-4 md:p-8">
      <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mb-4"></div>
      <h1 className="text-2xl font-bold text-white mb-2">Logging out...</h1>
      <p className="text-slate-400">Please wait while we complete the logout process.</p>
    </main>
  );
}

// Main component that wraps the content with the AuthProvider
export default function LogoutPage() {
  return (
    <AuthProvider>
      <LogoutContent />
    </AuthProvider>
  );
}