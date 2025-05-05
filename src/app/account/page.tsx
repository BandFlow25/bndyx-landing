//path: src/app/account/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { BndyLogo, useAuth } from 'bndy-ui';
import { ArrowLeft, LogOut } from 'lucide-react';
import Link from 'next/link';
import Providers from '../providers';

// Import modular components
import {
  ProfileTab,
  SettingsTab,
  NotificationsTab,
  SecurityTab,
  SidebarNavigation,
  MobileNavigation,
  AppLinks
} from './components';

export default function AccountPage() {
  console.log("AccountPage rendering");
  return (
    <Providers>
      <AccountContent />
    </Providers>
  );
}

function AccountContent() {
  console.log("AccountContent rendering");
  const router = useRouter();
  const { currentUser, signOut, sendVerificationEmail, isLoading, getErrorMessage } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [verificationSent, setVerificationSent] = useState(false);
  const [sendingVerification, setSendingVerification] = useState(false);
  const [authCheckComplete, setAuthCheckComplete] = useState(false);

  // Log auth state every time it changes
  useEffect(() => {
    console.log("Auth state update:", {
      isLoading,
      hasUser: !!currentUser,
      authCheckComplete,
      timestamp: new Date().toISOString()
    });
    
    // If we have a user, we can immediately show the account page
    if (currentUser) {
      console.log("User detected, marking auth check complete");
      setAuthCheckComplete(true);
    }
  }, [isLoading, currentUser, authCheckComplete]);

  // Only allow redirect after a short delay to give auth time to settle
  useEffect(() => {
    if (!authCheckComplete && !isLoading) {
      console.log("Setting up short auth check timeout");
      const timer = setTimeout(() => {
        console.log("Auth check timeout complete");
        setAuthCheckComplete(true);
      }, 500); // Just 500ms should be plenty

      return () => clearTimeout(timer);
    }
  }, [isLoading, authCheckComplete]);

  // Handle redirect logic after the auth check is complete
  useEffect(() => {
    if (authCheckComplete && !currentUser) {
      console.log("Auth check complete with no user, redirecting to login");
      router.push('/login?returnTo=/account');
    }
  }, [authCheckComplete, currentUser, router]);

  // Show loading state only while auth is checking
  if (isLoading || (!authCheckComplete && !currentUser)) {
    console.log("Rendering loading state", { isLoading, authCheckComplete });
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Auth check is complete and no user, show auth required message
  if (!currentUser) {
    console.log("Rendering auth required message");
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 max-w-md text-center">
          <h2 className="text-xl font-bold text-slate-900 mb-2">Authentication Required</h2>
          <p className="text-slate-600 mb-4">Please log in to access your account.</p>
          <Link 
            href="/login?returnTo=/account" 
            className="inline-block px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  // We have a user, show the account page
  console.log("Rendering account page for user:", currentUser?.email);

  const handleSendVerification = async () => {
    try {
      console.log("Sending verification email...");
      setSendingVerification(true);
      await sendVerificationEmail();
      setVerificationSent(true);
      console.log("Verification email sent successfully");
    } catch (err) {
      // Error is already handled by the AuthContext
      console.error('Error sending verification email:', err);
    } finally {
      setSendingVerification(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/');
    } catch (err) {
      // Error is already handled by the AuthContext
      console.error('Error signing out:', err);
    }
  };

  return (
    <main className="min-h-screen flex flex-col bg-white">
      <div className="bg-slate-900 text-white p-4">
        <div className="max-w-6xl mx-auto">
          <Link
            href="/"
            className="inline-flex items-center text-slate-400 hover:text-white transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <BndyLogo className="h-8 w-auto mr-4" color="#f97316" holeColor="#1e293b" />
              <h1 className="text-2xl font-bold text-white">Your Account</h1>
            </div>

            <button
              onClick={handleSignOut}
              className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-white bg-slate-800 hover:bg-slate-700 border border-slate-700"
            >
              <LogOut size={16} className="mr-2" />
              Sign Out
            </button>
          </div>
        </div>
      </div>

      <div className="flex-grow p-4 md:p-8 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Mobile Navigation */}
            <div className="lg:hidden">
              <MobileNavigation 
                activeTab={activeTab} 
                setActiveTab={setActiveTab} 
              />
            </div>

            {/* Sidebar Navigation (Desktop) */}
            <div className="hidden lg:block lg:col-span-1">
              <SidebarNavigation 
                activeTab={activeTab} 
                setActiveTab={setActiveTab} 
                onSignOut={handleSignOut}
              />
              
              {/* App Links */}
              <div className="mt-6">
                <AppLinks />
              </div>
            </div>

            {/* Main Content Area */}
            <div className="lg:col-span-3">
              {activeTab === 'profile' && (
                <ProfileTab 
                  verificationSent={verificationSent} 
                  sendingVerification={sendingVerification} 
                  handleSendVerification={handleSendVerification} 
                />
              )}
              
              {activeTab === 'settings' && (
                <SettingsTab />
              )}
              
              {activeTab === 'notifications' && (
                <NotificationsTab />
              )}
              
              {activeTab === 'security' && (
                <SecurityTab />
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
