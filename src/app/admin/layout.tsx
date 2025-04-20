'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Users, Settings } from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar */}
          <div className="w-full md:w-64 bg-white shadow rounded-lg p-4 h-fit">
            <div className="flex items-center mb-6">
              <ShieldCheck className="text-orange-500 mr-2" />
              <h2 className="text-lg font-semibold">Admin</h2>
            </div>
            
            <nav className="space-y-1">
              <Link 
                href="/admin"
                className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-orange-500"
              >
                <Settings className="mr-2 h-4 w-4" />
                Dashboard
              </Link>
              
              <Link 
                href="/admin/users"
                className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-orange-500"
              >
                <Users className="mr-2 h-4 w-4" />
                User Management
              </Link>
            </nav>
          </div>
          
          {/* Main content */}
          <div className="flex-1 bg-white shadow rounded-lg p-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
