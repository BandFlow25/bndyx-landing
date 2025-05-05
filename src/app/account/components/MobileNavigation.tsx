'use client';

import React from 'react';
import { User, Settings, Bell, Lock } from 'lucide-react';

interface MobileNavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const MobileNavigation: React.FC<MobileNavigationProps> = ({
  activeTab,
  setActiveTab
}) => {
  return (
    <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm p-4 lg:hidden">
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setActiveTab('profile')}
          className={`flex items-center justify-center flex-1 px-3 py-2 text-sm font-medium rounded ${
            activeTab === 'profile'
              ? 'bg-orange-500 text-white'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <User size={16} className="mr-2" />
          Profile
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`flex items-center justify-center flex-1 px-3 py-2 text-sm font-medium rounded ${
            activeTab === 'settings'
              ? 'bg-orange-500 text-white'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Settings size={16} className="mr-2" />
          Settings
        </button>

        <button
          onClick={() => setActiveTab('notifications')}
          className={`flex items-center justify-center flex-1 px-3 py-2 text-sm font-medium rounded ${
            activeTab === 'notifications'
              ? 'bg-orange-500 text-white'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Bell size={16} className="mr-2" />
          Alerts
        </button>

        <button
          onClick={() => setActiveTab('security')}
          className={`flex items-center justify-center flex-1 px-3 py-2 text-sm font-medium rounded ${
            activeTab === 'security'
              ? 'bg-orange-500 text-white'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Lock size={16} className="mr-2" />
          Security
        </button>
      </div>
    </div>
  );
};
