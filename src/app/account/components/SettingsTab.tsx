'use client';

import React from 'react';
import { useAuth } from 'bndy-ui';

export const SettingsTab: React.FC = () => {
  const { currentUser } = useAuth();

  if (!currentUser) return null;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm p-6">
        <h3 className="text-lg font-medium text-slate-900 mb-4">Preferences</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-slate-900">Email Notifications</h4>
              <p className="text-sm text-slate-500">
                Receive email notifications about account activity
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-slate-900">Marketing Communications</h4>
              <p className="text-sm text-slate-500">
                Receive updates about new features and promotions
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-slate-900">Dark Mode</h4>
              <p className="text-sm text-slate-500">
                Switch between light and dark theme
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
            </label>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm p-6">
        <h3 className="text-lg font-medium text-slate-900 mb-4">Language & Region</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Language
            </label>
            <select className="w-full p-2 border border-slate-300 rounded-md">
              <option value="en">English (UK)</option>
              <option value="en-us">English (US)</option>
              <option value="fr">French</option>
              <option value="de">German</option>
              <option value="es">Spanish</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Time Zone
            </label>
            <select className="w-full p-2 border border-slate-300 rounded-md">
              <option value="UTC">UTC (Coordinated Universal Time)</option>
              <option value="GMT">GMT (Greenwich Mean Time)</option>
              <option value="EST">EST (Eastern Standard Time)</option>
              <option value="CST">CST (Central Standard Time)</option>
              <option value="PST">PST (Pacific Standard Time)</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};
