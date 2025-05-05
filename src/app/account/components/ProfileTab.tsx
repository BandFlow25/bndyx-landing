'use client';

import React from 'react';
import { CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from 'bndy-ui';
import Image from 'next/image';

interface ProfileTabProps {
  verificationSent: boolean;
  sendingVerification: boolean;
  handleSendVerification: () => Promise<void>;
}

export const ProfileTab: React.FC<ProfileTabProps> = ({
  verificationSent,
  sendingVerification,
  handleSendVerification
}) => {
  const { currentUser } = useAuth();

  if (!currentUser) return null;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="relative h-20 w-20 rounded-full overflow-hidden bg-slate-200">
            {currentUser.photoURL ? (
              <Image
                src={currentUser.photoURL}
                alt={currentUser.displayName || 'User'}
                fill
                className="object-cover"
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center text-slate-400 text-xl font-medium">
                {currentUser.displayName ? currentUser.displayName.charAt(0).toUpperCase() : 'U'}
              </div>
            )}
          </div>
          <div>
            <h2 className="text-xl font-semibold text-slate-900">
              {currentUser.displayName || 'User'}
            </h2>
            <div className="flex items-center mt-1">
              <p className="text-slate-500">{currentUser.email}</p>
              {currentUser.emailVerified ? (
                <span className="ml-2 inline-flex items-center text-green-600 text-sm">
                  <CheckCircle size={14} className="mr-1" />
                  Verified
                </span>
              ) : (
                <span className="ml-2 inline-flex items-center text-amber-600 text-sm">
                  <AlertCircle size={14} className="mr-1" />
                  Not verified
                </span>
              )}
            </div>
            {!currentUser.emailVerified && (
              <button
                onClick={handleSendVerification}
                disabled={sendingVerification || verificationSent}
                className={`mt-2 text-sm px-3 py-1 rounded ${
                  verificationSent
                    ? 'bg-green-100 text-green-700'
                    : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                }`}
              >
                {verificationSent
                  ? 'Verification email sent!'
                  : sendingVerification
                  ? 'Sending...'
                  : 'Send verification email'}
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm p-6">
        <h3 className="text-lg font-medium text-slate-900 mb-4">Account Details</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              User ID
            </label>
            <div className="bg-slate-100 p-2 rounded text-sm text-slate-600 font-mono break-all">
              {currentUser.uid}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Account Created
            </label>
            <div className="text-slate-600">
              {currentUser.metadata?.creationTime
                ? new Date(currentUser.metadata.creationTime).toLocaleString()
                : 'Unknown'}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Last Sign In
            </label>
            <div className="text-slate-600">
              {currentUser.metadata?.lastSignInTime
                ? new Date(currentUser.metadata.lastSignInTime).toLocaleString()
                : 'Unknown'}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Account Provider
            </label>
            <div className="text-slate-600">
              {currentUser.providerData && currentUser.providerData.length > 0
                ? currentUser.providerData[0].providerId.replace('.com', '')
                : 'Email/Password'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
