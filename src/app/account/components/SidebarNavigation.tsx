'use client';

import React from 'react';
import { User, Settings, Bell, Lock, LogOut } from 'lucide-react';
import { useAuth } from 'bndy-ui';

interface SidebarNavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onSignOut: () => void;
}

export const SidebarNavigation: React.FC<SidebarNavigationProps> = ({
  activeTab,
  setActiveTab,
  onSignOut
}) => {
  const { currentUser } = useAuth();

  if (!currentUser) return null;

  return (
    <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm">
      <nav className="flex flex-col">
        <button
          onClick={() => setActiveTab('profile')}
          className={`flex items-center px-4 py-3 text-left ${
            activeTab === 'profile'
              ? 'bg-orange-500 text-white'
              : 'hover:bg-slate-100 text-slate-700'
          }`}
        >
          <User size={18} className="mr-2" />
          <span>Profile</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`flex items-center px-4 py-3 text-left ${
            activeTab === 'settings'
              ? 'bg-orange-500 text-white'
              : 'hover:bg-slate-100 text-slate-700'
          }`}
        >
          <Settings size={18} className="mr-2" />
          <span>Settings</span>
        </button>

        <button
          onClick={() => setActiveTab('notifications')}
          className={`flex items-center px-4 py-3 text-left ${
            activeTab === 'notifications'
              ? 'bg-orange-500 text-white'
              : 'hover:bg-slate-100 text-slate-700'
          }`}
        >
          <Bell size={18} className="mr-2" />
          <span>Alerts</span>
        </button>

        <button
          onClick={() => setActiveTab('security')}
          className={`flex items-center px-4 py-3 text-left ${
            activeTab === 'security'
              ? 'bg-orange-500 text-white'
              : 'hover:bg-slate-100 text-slate-700'
          }`}
        >
          <Lock size={18} className="mr-2" />
          <span>Security</span>
        </button>

        <button
          onClick={onSignOut}
          className="flex items-center px-4 py-3 text-left text-red-600 hover:bg-red-50"
        >
          <LogOut size={18} className="mr-2" />
          <span>Sign Out</span>
        </button>
      </nav>
    </div>
  );
};
