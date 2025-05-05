'use client';

import React from 'react';
import { useAuth } from 'bndy-ui';
import { Bell } from 'lucide-react';

export const NotificationsTab: React.FC = () => {
  const { currentUser } = useAuth();

  if (!currentUser) return null;

  const notifications = [
    {
      id: 1,
      title: 'Welcome to BNDY',
      message: 'Thank you for joining the BNDY platform!',
      date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      read: true
    },
    {
      id: 2,
      title: 'Complete your profile',
      message: 'Add more details to your profile to get the most out of BNDY.',
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      read: false
    },
    {
      id: 3,
      title: 'New feature available',
      message: 'Check out our new calendar integration for managing your events!',
      date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      read: false
    }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-slate-900">Notifications</h3>
          <button className="text-sm text-blue-600 hover:text-blue-800">
            Mark all as read
          </button>
        </div>

        {notifications.length > 0 ? (
          <div className="divide-y divide-slate-200">
            {notifications.map((notification) => (
              <div 
                key={notification.id} 
                className={`py-4 ${!notification.read ? 'bg-orange-50' : ''}`}
              >
                <div className="flex items-start">
                  <div className={`p-2 rounded-full ${!notification.read ? 'bg-orange-100 text-orange-600' : 'bg-slate-100 text-slate-500'} mr-3`}>
                    <Bell size={16} />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h4 className={`text-sm font-medium ${!notification.read ? 'text-slate-900' : 'text-slate-700'}`}>
                        {notification.title}
                      </h4>
                      <span className="text-xs text-slate-500">
                        {new Date(notification.date).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 mt-1">
                      {notification.message}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 text-slate-400 mb-4">
              <Bell size={24} />
            </div>
            <h3 className="text-lg font-medium text-slate-900 mb-1">No notifications</h3>
            <p className="text-slate-500">You're all caught up!</p>
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm p-6">
        <h3 className="text-lg font-medium text-slate-900 mb-4">Notification Settings</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-slate-900">Email Notifications</h4>
              <p className="text-sm text-slate-500">
                Receive notifications via email
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-slate-900">Push Notifications</h4>
              <p className="text-sm text-slate-500">
                Receive push notifications in your browser
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};
