'use client';

import React, { useEffect } from 'react';
import { AuthProvider, GoogleMapsProvider, initFirebase } from 'bndy-ui';

interface ProvidersProps {
  children: React.ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  // Initialize Firebase on the client side
  useEffect(() => {
    if (process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
      initFirebase({
        apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || '',
        authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || '',
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || '',
        storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || '',
        messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '',
        appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '',
      });
    }
  }, []);

  // Get Google Maps API key from environment variables
  const mapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";
  
  return (
    <AuthProvider>
      {mapsApiKey ? (
        // Only render GoogleMapsProvider when API key is available
        <GoogleMapsProvider apiKey={mapsApiKey}>
          {children}
        </GoogleMapsProvider>
      ) : (
        // Skip the GoogleMapsProvider when no API key is available
        children
      )}
    </AuthProvider>
  );
}
