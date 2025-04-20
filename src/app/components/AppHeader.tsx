//path: src/app/components/AppHeader.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { BndyLogo, useAuth } from 'bndy-ui';
import { Menu, X, LogIn, LogOut, User, ShieldCheck } from 'lucide-react';

export function AppHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { currentUser, signOut } = useAuth();
  
  // Debug user roles and godMode status
  useEffect(() => {
    if (currentUser) {
      console.log('Current user in AppHeader:', {
        uid: currentUser.uid,
        email: currentUser.email,
        roles: currentUser.roles,
        godMode: (currentUser as any).godMode
      });
    }
  }, [currentUser]);

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <BndyLogo className="h-8 w-auto" color="#f97316" holeColor='#ffffff' />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            <Link 
              href="/" 
              className="px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:text-orange-500"
            >
              Home
            </Link>
            <Link 
              href="https://bndy.live" 
              className="px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:text-orange-500"
            >
              Discover
            </Link>
            <Link 
              href="https://my.bndy.co.uk" 
              className="px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:text-orange-500"
            >
              Manage
            </Link>
            <Link 
              href="/about" 
              className="px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:text-orange-500"
            >
              About
            </Link>

            {currentUser ? (
              <div className="flex items-center ml-4">
                {/* Admin icon - always visible for testing */}
                <Link
                  href="/admin"
                  className="flex items-center justify-center mr-3 p-1 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors"
                  title="Admin Panel"
                >
                  <ShieldCheck 
                    size={22} 
                    className="text-orange-500" 
                  />
                </Link>
                <Link
                  href="/account"
                  className="flex items-center justify-center mr-3 p-1 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors"
                >
                  <User 
                    size={22} 
                    fill="#FFD700" 
                    color="#FFD700" 
                    className="filter drop-shadow-sm" 
                  />
                </Link>
                <button 
                  onClick={() => signOut()}
                  className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 transition-colors"
                >
                  <LogOut size={16} className="mr-1" />
                  Sign out
                </button>
              </div>
            ) : (
              <Link href="/login">
                <div className="ml-4 flex items-center px-3 py-2 rounded-md text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 transition-colors">
                  <LogIn size={16} className="mr-1" />
                  Sign in
                </div>
              </Link>
            )}
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-md text-slate-500 hover:text-slate-700"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="pt-2 pb-3 space-y-1 px-4 sm:px-6 lg:px-8 border-t border-slate-200">
            <Link 
              href="/" 
              className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-orange-500"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              href="https://bndy.live" 
              className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-orange-500"
              onClick={() => setIsMenuOpen(false)}
            >
              Discover
            </Link>
            <Link 
              href="https://my.bndy.co.uk" 
              className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-orange-500"
              onClick={() => setIsMenuOpen(false)}
            >
              Manage
            </Link>
            <Link 
              href="/about" 
              className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-orange-500"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
            
            {currentUser ? (
              <>
                {/* Admin link - always visible for testing */}
                  <Link 
                    href="/admin"
                    className="flex items-center px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-orange-500"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <ShieldCheck 
                      size={20} 
                      className="mr-2 text-orange-500" 
                    />
                    Admin Panel
                  </Link>
                <Link 
                  href="/account"
                  className="flex items-center px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-orange-500"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <User 
                    size={20} 
                    fill="#FFD700" 
                    color="#FFD700" 
                    className="mr-2 filter drop-shadow-sm" 
                  />
                  Account
                </Link>
                <button 
                  onClick={() => {
                    signOut();
                    setIsMenuOpen(false);
                  }}
                  className="w-full mt-2 flex items-center justify-center px-3 py-2 rounded-md text-base font-medium text-white bg-orange-500 hover:bg-orange-600"
                >
                  <LogOut size={16} className="mr-1" />
                  Sign out
                </button>
              </>
            ) : (
              <Link 
                href="/login"
                onClick={() => setIsMenuOpen(false)}
                className="w-full mt-2 block"
              >
                <div className="flex items-center justify-center px-3 py-2 rounded-md text-base font-medium text-white bg-orange-500 hover:bg-orange-600">
                  <LogIn size={16} className="mr-1" />
                  Sign in
                </div>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}