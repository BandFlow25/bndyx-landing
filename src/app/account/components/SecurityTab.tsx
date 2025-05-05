'use client';

import React, { useState } from 'react';
import { useAuth } from 'bndy-ui';
import { Lock, Eye, EyeOff } from 'lucide-react';

export const SecurityTab: React.FC = () => {
  const { currentUser, resetPassword, confirmReset } = useAuth();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!currentUser) return null;

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset states
    setError(null);
    setSuccess(null);
    
    // Validate passwords
    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }
    
    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // First, send a password reset email to the user's email address
      if (!currentUser?.email) {
        throw new Error('No email associated with this account');
      }
      
      // In a real implementation, we would need to:
      // 1. Send a password reset email
      await resetPassword(currentUser.email);
      
      // 2. Display instructions to the user to check their email
      setSuccess('Password reset email sent. Please check your email to complete the password change process.');
      
      // Note: In a real app, we would need to get the reset code from the email link
      // and then use confirmReset(code, newPassword) to complete the process
      // This would typically be done on a separate password reset page
      
      // Clear form
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      setError(error.message || 'Failed to send password reset email');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm p-6">
        <h3 className="text-lg font-medium text-slate-900 mb-4">Change Password</h3>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-200 text-red-700 rounded-md">
            {error}
          </div>
        )}
        
        {success && (
          <div className="mb-4 p-3 bg-green-100 border border-green-200 text-green-700 rounded-md">
            {success}
          </div>
        )}
        
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Current Password
            </label>
            <div className="relative">
              <input
                type={showCurrentPassword ? 'text' : 'password'}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full p-2 pr-10 border border-slate-300 rounded-md"
                required
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 px-3 flex items-center text-slate-500"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              >
                {showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              New Password
            </label>
            <div className="relative">
              <input
                type={showNewPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full p-2 pr-10 border border-slate-300 rounded-md"
                required
                minLength={8}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 px-3 flex items-center text-slate-500"
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Password must be at least 8 characters long
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Confirm New Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full p-2 pr-10 border border-slate-300 rounded-md"
                required
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 px-3 flex items-center text-slate-500"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </div>
      
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm p-6">
        <h3 className="text-lg font-medium text-slate-900 mb-4">Two-Factor Authentication</h3>
        <p className="text-slate-600 mb-4">
          Add an extra layer of security to your account by enabling two-factor authentication.
        </p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="p-2 rounded-full bg-slate-100 text-slate-500 mr-3">
              <Lock size={16} />
            </div>
            <div>
              <h4 className="text-sm font-medium text-slate-900">Two-Factor Authentication</h4>
              <p className="text-sm text-slate-500">
                Not enabled
              </p>
            </div>
          </div>
          <button className="px-3 py-1 bg-orange-100 text-orange-700 rounded-md hover:bg-orange-200">
            Enable
          </button>
        </div>
      </div>
      
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm p-6">
        <h3 className="text-lg font-medium text-slate-900 mb-4">Login Sessions</h3>
        <div className="space-y-4">
          <div className="flex items-start">
            <div className="p-2 rounded-full bg-green-100 text-green-600 mr-3">
              <Lock size={16} />
            </div>
            <div className="flex-1">
              <div className="flex justify-between">
                <h4 className="text-sm font-medium text-slate-900">
                  Current Session
                </h4>
                <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                  Active
                </span>
              </div>
              <p className="text-sm text-slate-600 mt-1">
                {navigator.userAgent.split(' ').slice(-1)[0].replace('/', ' ')}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Started {new Date().toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
