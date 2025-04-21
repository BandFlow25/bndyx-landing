// src/lib/firebase-admin.ts
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

// Initialize Firebase Admin if not already initialized
if (!getApps().length) {
  try {
    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
    
    if (process.env.NODE_ENV === 'development') {
      console.log('Development mode: Initializing Firebase Admin with app-only config');
      // For development use only the project ID
      initializeApp({
        projectId: projectId || 'bandflow2025' // Use your actual project ID
      });
    } else if (process.env.FIREBASE_ADMIN_CREDENTIALS) {
      console.log('Production mode: Initializing Firebase Admin with full credentials');
      initializeApp({
        credential: cert(JSON.parse(process.env.FIREBASE_ADMIN_CREDENTIALS)),
        projectId,
      });
    } else {
      console.warn('No Firebase Admin credentials found, using minimal initialization');
      initializeApp({
        projectId: projectId || 'fallback-project-id'
      });
    }
  } catch (error) {
    console.error('Firebase Admin initialization error:', error);
    console.log('Will proceed with partial functionality');
  }
}

// Get Auth and Firestore instances with error handling
let adminAuth: any, adminDb: any;

try {
  adminAuth = getAuth();
  console.log('Firebase Admin Auth initialized successfully');
} catch (error) {
  console.error('Error initializing Firebase Admin Auth:', error);
  // No mocks - we always want to use real data
  throw new Error('Failed to initialize Firebase Admin Auth - cannot proceed without proper authentication');
}

try {
  adminDb = getFirestore();
  console.log('Firebase Admin Firestore initialized successfully');
} catch (error) {
  console.error('Error initializing Firebase Admin Firestore:', error);
  // No mocks - we always want to use real data
  throw new Error('Failed to initialize Firebase Admin Firestore - cannot proceed without database access');
}

export { adminAuth, adminDb };