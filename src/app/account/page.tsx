//path: src/app/account/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AuthProvider, BndyLogo, useAuth, UserRole } from 'bndy-ui';
import { Settings, User, Bell, Lock, ExternalLink, LogOut, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function AccountPage() {
  console.log("AccountPage rendering");
  return (
    <AuthProvider>
      <AccountContent />
    </AuthProvider>
  );
}

function AccountContent() {
  console.log("AccountContent rendering");
  const router = useRouter();
  const { currentUser, signOut, sendVerificationEmail, isLoading } = useAuth();
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
  console.log("Rendering account page for user:", currentUser.email);

  const handleSendVerification = async () => {
    try {
      console.log("Sending verification email...");
      setSendingVerification(true);
      await sendVerificationEmail();
      setVerificationSent(true);
      console.log("Verification email sent successfully");
    } catch (err) {
      console.error('Error sending verification email:', err);
    } finally {
      setSendingVerification(false);
    }
  };

  const appLinks = [
    {
      name: 'BNDY Live',
      description: 'Discover music events near you',
      url: 'https://bndy.live',
      role: 'user' as UserRole,
      icon: <ExternalLink className="w-4 h-4 ml-1" />
    },
    {
      name: 'BNDY App',
      description: 'Manage your music, setlists, and events',
      url: 'https://my.bndy.co.uk',
      role: ['live_admin', 'live_builder', 'live_giggoer', 'bndy_band', 'bndy_artist', 'bndy_venue', 'bndy_agent', 'bndy_studio', 'user'] as UserRole[],
      icon: <ExternalLink className="w-4 h-4 ml-1" />
    }
  ];

  const hasRole = (role: UserRole | UserRole[]) => {
    if (!currentUser || !currentUser.roles) return false;

    if (Array.isArray(role)) {
      return role.some(r => currentUser.roles?.includes(r));
    }

    return currentUser.roles.includes(role);
  };

  // Remove RequireAuth wrapper and handle auth directly
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
              onClick={() => {
                signOut();
                router.push('/');
              }}
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
            {/* Mobile Tab Selection */}
            <div className="lg:hidden">
              <div className="bg-white rounded-lg border border-slate-200 p-1 flex space-x-1 shadow-sm">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`flex items-center justify-center flex-1 px-3 py-2 text-sm font-medium rounded ${activeTab === 'profile'
                      ? 'bg-orange-500 text-white'
                      : 'text-slate-600 hover:bg-slate-100'
                    }`}
                >
                  <User size={16} className="mr-2" />
                  Profile
                </button>

                <button
                  onClick={() => setActiveTab('settings')}
                  className={`flex items-center justify-center flex-1 px-3 py-2 text-sm font-medium rounded ${activeTab === 'settings'
                      ? 'bg-orange-500 text-white'
                      : 'text-slate-600 hover:bg-slate-100'
                    }`}
                >
                  <Settings size={16} className="mr-2" />
                  Settings
                </button>

                <button
                  onClick={() => setActiveTab('notifications')}
                  className={`flex items-center justify-center flex-1 px-3 py-2 text-sm font-medium rounded ${activeTab === 'notifications'
                      ? 'bg-orange-500 text-white'
                      : 'text-slate-600 hover:bg-slate-100'
                    }`}
                >
                  <Bell size={16} className="mr-2" />
                  Alerts
                </button>

                <button
                  onClick={() => setActiveTab('security')}
                  className={`flex items-center justify-center flex-1 px-3 py-2 text-sm font-medium rounded ${activeTab === 'security'
                      ? 'bg-orange-500 text-white'
                      : 'text-slate-600 hover:bg-slate-100'
                    }`}
                >
                  <Lock size={16} className="mr-2" />
                  Security
                </button>
              </div>
            </div>

            {/* Sidebar Navigation (Desktop) */}
            <div className="hidden lg:block lg:col-span-1">
              <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm">
                <nav className="flex flex-col">
                  <button
                    onClick={() => setActiveTab('profile')}
                    className={`flex items-center px-4 py-3 text-left ${activeTab === 'profile'
                        ? 'bg-orange-500 text-white'
                        : 'hover:bg-slate-100 text-slate-700'
                      }`}
                  >
                    <User size={18} className="mr-2" />
                    <span>Profile</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('settings')}
                    className={`flex items-center px-4 py-3 text-left ${activeTab === 'settings'
                        ? 'bg-orange-500 text-white'
                        : 'hover:bg-slate-100 text-slate-700'
                      }`}
                  >
                    <Settings size={18} className="mr-2" />
                    <span>Settings</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('notifications')}
                    className={`flex items-center px-4 py-3 text-left ${activeTab === 'notifications'
                        ? 'bg-orange-500 text-white'
                        : 'hover:bg-slate-100 text-slate-700'
                      }`}
                  >
                    <Bell size={18} className="mr-2" />
                    <span>Notifications</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('security')}
                    className={`flex items-center px-4 py-3 text-left ${activeTab === 'security'
                        ? 'bg-orange-500 text-white'
                        : 'hover:bg-slate-100 text-slate-700'
                      }`}
                  >
                    <Lock size={18} className="mr-2" />
                    <span>Security</span>
                  </button>
                </nav>
              </div>

              <div className="mt-6 space-y-3">
                {appLinks.map((app, index) => {
                  const shouldShow = app.role === 'user' || hasRole(app.role);

                  if (!shouldShow) return null;

                  return (
                    <a
                      key={index}
                      href={app.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between w-full p-3 rounded-md border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 shadow-sm"
                    >
                      <div>
                        <div className="font-medium">{app.name}</div>
                        <div className="text-sm text-slate-500">{app.description}</div>
                      </div>
                      {app.icon}
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-lg border border-slate-200 shadow-sm">
                {activeTab === 'profile' && (
                  <div className="p-6">
                    <h2 className="text-xl font-bold mb-6 text-slate-900 border-b border-slate-200 pb-2">
                      Your Profile
                    </h2>

                    <div className="flex flex-col md:flex-row md:items-center mb-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
                      <div className="mb-4 md:mb-0 md:mr-4">
                        {currentUser?.photoURL ? (
                          <Image
                            src={currentUser.photoURL}
                            alt={currentUser.displayName || 'User'}
                            width={64}
                            height={64}
                            className="rounded-full"
                          />
                        ) : (
                          <div className="h-16 w-16 rounded-full bg-slate-200 flex items-center justify-center">
                            <span className="text-lg font-medium text-slate-700">
                              {currentUser?.displayName?.charAt(0).toUpperCase() || currentUser?.email?.charAt(0).toUpperCase() || 'U'}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="flex-1">
                        <h3 className="font-medium text-slate-900 text-lg">
                          {currentUser?.displayName || 'User'}
                        </h3>
                        <p className="text-slate-500">
                          {currentUser?.email}
                        </p>
                        <div className="mt-1 flex items-center">
                          {currentUser?.emailVerified ? (
                            <div className="text-green-600 text-sm flex items-center">
                              <CheckCircle size={14} className="mr-1" />
                              Email verified
                            </div>
                          ) : (
                            <div className="text-amber-600 text-sm flex items-center">
                              <AlertCircle size={14} className="mr-1" />
                              Email not verified
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Roles section */}
                    <div className="mt-8 pt-6 border-t border-slate-200">
                      <h3 className="text-lg font-medium mb-4 text-slate-900">
                        Your Roles
                      </h3>

                      <div className="space-y-4">
                        {currentUser?.roles && currentUser.roles.length > 0 ? (
                          <div className="flex flex-wrap gap-2">
                            {currentUser.roles.map((role, index) => (
                              <span
                                key={index}
                                className="px-3 py-1 bg-slate-100 rounded-full text-sm text-slate-700"
                              >
                                {role.charAt(0).toUpperCase() + role.slice(1).replace('_', ' ')}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <p className="text-slate-500">
                            You have the default user role.
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Mobile App Links */}
                    <div className="mt-8 pt-6 border-t border-slate-200 lg:hidden">
                      <h3 className="text-lg font-medium mb-4 text-slate-900">
                        BNDY Apps
                      </h3>

                      <div className="space-y-3">
                        {appLinks.map((app, index) => {
                          const shouldShow = app.role === 'user' || hasRole(app.role);

                          if (!shouldShow) return null;

                          return (
                            <a
                              key={index}
                              href={app.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center justify-between w-full p-3 rounded-md border border-slate-200 bg-white hover:bg-slate-50 text-slate-700"
                            >
                              <div>
                                <div className="font-medium">{app.name}</div>
                                <div className="text-sm text-slate-500">{app.description}</div>
                              </div>
                              {app.icon}
                            </a>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'settings' && (
                  <div className="p-6">
                    <h2 className="text-xl font-bold mb-6 text-slate-900 border-b border-slate-200 pb-2">
                      Account Settings
                    </h2>
                    <p className="text-slate-600 mb-8">
                      Account settings will be available in a future update.
                    </p>

                    <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                      <h3 className="font-medium mb-2">Coming Soon</h3>
                      <ul className="space-y-2 text-slate-600">
                        <li>• Profile information updates</li>
                        <li>• Notification preferences</li>
                        <li>• Language and regional settings</li>
                        <li>• Privacy controls</li>
                      </ul>
                    </div>
                  </div>
                )}

                {activeTab === 'notifications' && (
                  <div className="p-6">
                    <h2 className="text-xl font-bold mb-6 text-slate-900 border-b border-slate-200 pb-2">
                      Notification Preferences
                    </h2>
                    <p className="text-slate-600 mb-8">
                      Notification settings will be available in a future update.
                    </p>

                    <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                      <h3 className="font-medium mb-2">Coming Soon</h3>
                      <ul className="space-y-2 text-slate-600">
                        <li>• Email notification preferences</li>
                        <li>• Push notification settings</li>
                        <li>• Event alerts and reminders</li>
                        <li>• Weekly digest options</li>
                      </ul>
                    </div>
                  </div>
                )}

                {activeTab === 'security' && (
                  <div className="p-6">
                    <h2 className="text-xl font-bold mb-6 text-slate-900 border-b border-slate-200 pb-2">
                      Security
                    </h2>
                    <p className="text-slate-600 mb-6">
                      Manage your password and account security settings.
                    </p>

                    <div className="space-y-6">
                      <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                        <h3 className="font-medium mb-3">Password</h3>
                        <p className="text-slate-600 text-sm mb-3">
                          Change your password or reset it if you&apos;ve forgotten it.
                        </p>
                        <button
                          onClick={() => router.push('/reset-password')}
                          className="px-4 py-2 border border-slate-300 rounded-md hover:bg-slate-100 text-sm font-medium"
                        >
                          Change Password
                        </button>
                      </div>

                      <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                        <h3 className="font-medium mb-3">Email Verification</h3>

                        {currentUser?.emailVerified ? (
                          <div className="text-green-600 flex items-center">
                            <CheckCircle className="w-5 h-5 mr-2" />
                            Your email address is verified
                          </div>
                        ) : (
                          <div>
                            <div className="text-amber-600 flex items-center mb-3">
                              <AlertCircle className="w-5 h-5 mr-2" />
                              Your email address is not verified
                            </div>

                            {verificationSent ? (
                              <div className="text-green-600 text-sm mt-2">
                                Verification email sent! Please check your inbox and spam folder.
                                The verification link is only valid for a limited time.
                              </div>
                            ) : (
                              <button
                                onClick={handleSendVerification}
                                disabled={sendingVerification}
                                className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 disabled:bg-orange-300 disabled:cursor-not-allowed text-sm font-medium"
                              >
                                {sendingVerification ? 'Sending...' : 'Send Verification Email'}
                              </button>
                            )}
                            
                            <p className="text-slate-500 text-sm mt-3">
                              Verifying your email ensures you can recover your account 
                              and receive important notifications about your BNDY account.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}