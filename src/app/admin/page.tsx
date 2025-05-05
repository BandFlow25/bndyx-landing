'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from 'bndy-ui';
import { ShieldCheck, Search, Loader2 } from 'lucide-react';
import Providers from '../providers';

export default function AdminPage() {
  return (
    <Providers>
      <AdminContent />
    </Providers>
  );
}

function AdminContent() {
  const { currentUser, isLoading } = useAuth();
  const router = useRouter();
  
  // Debug user info and check admin access
  useEffect(() => {
    // Add a small delay to ensure auth state is fully loaded
    const checkAuth = setTimeout(() => {
      if (!isLoading) {
        if (currentUser) {
          // Log user details for debugging
          console.log('Admin page - Current user:', {
            uid: currentUser?.uid,
            email: currentUser?.email,
            roles: currentUser?.roles,
            godMode: (currentUser as any)?.godMode
          });
          
          // Check if user has admin access
          const hasAdminRole = Array.isArray(currentUser?.roles) && currentUser?.roles?.includes('admin' as any);
          const hasGodMode = (currentUser as any).godMode === true;
          
          console.log('Admin access check:', { hasAdminRole, hasGodMode });
          
          // For development, allow access with admin role regardless of godMode
          if (hasAdminRole) {
            console.log('User has admin role, allowing access');
            // Don't redirect, allow access
          } else {
            console.log('User does not have admin access, redirecting to home');
            router.push('/');
          }
        } else {
          // No user logged in
          console.log('No user logged in, redirecting to login');
          router.push('/login');
        }
      }
    }, 500); // Small delay to ensure auth state is loaded
    
    return () => clearTimeout(checkAuth);
  }, [currentUser, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
      </div>
    );
  }

  // If we're still here and have a user, they must be an admin
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center mb-8">
        <ShieldCheck className="w-8 h-8 text-orange-500 mr-3" />
        <h1 className="text-3xl font-bold">Admin Panel</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Admin Navigation Cards */}
        <div 
          onClick={() => router.push('/admin/users')}
          className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer"
        >
          <h2 className="text-xl font-semibold mb-2">User Management</h2>
          <p className="text-slate-600">View and manage user roles and permissions</p>
        </div>
        
        {/* Add more admin cards here as needed */}
      </div>
    </div>
  );
}
