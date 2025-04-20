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
  // Provide a mock implementation for development
  if (process.env.NODE_ENV === 'development') {
    adminAuth = {
      verifyIdToken: async (token: string) => {
        console.log('Development mock: verifyIdToken called');
        // Simple decode without verification
        const payload = JSON.parse(
          Buffer.from(token.split('.')[1], 'base64').toString()
        );
        return {
          uid: payload.user_id || payload.sub,
          email: payload.email
        };
      },
      getUser: async (uid: string) => {
        console.log('Development mock: getUser called with uid:', uid);
        return {
          uid,
          email: 'dev@example.com',
          displayName: 'Dev User',
          photoURL: null
        };
      }
    };
    console.log('Development mock for Firebase Admin Auth created');
  }
}

try {
  adminDb = getFirestore();
  console.log('Firebase Admin Firestore initialized successfully');
} catch (error) {
  console.error('Error initializing Firebase Admin Firestore:', error);
  // Provide a mock implementation for development
  if (process.env.NODE_ENV === 'development') {
    adminDb = {
      collection: (collectionName: string) => ({
        doc: (docId: string) => ({
          get: async () => ({
            exists: true,
            data: () => ({
              roles: ['user', 'live_giggoer', 'GODMODE'], // Default development roles
              email: 'dev@example.com',
              displayName: 'Dev User'
            })
          })
        })
      })
    };
    console.log('Development mock for Firebase Admin Firestore created');
  }
}

export { adminAuth, adminDb };