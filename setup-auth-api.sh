#!/bin/bash
# Script to set up authentication API routes for bndy-landing

# Create necessary directories
mkdir -p src/lib
mkdir -p src/app/api/auth/login
mkdir -p src/app/api/auth/token
mkdir -p src/app/api/auth/refresh
mkdir -p src/app/api/auth/verify
mkdir -p src/app/api/auth/logout

# Create firebase-admin.ts file
cat > src/lib/firebase-admin.ts << 'EOL'
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

// Initialize Firebase Admin if not already initialized
if (!getApps().length) {
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  
  // Use service account if provided, otherwise use a dummy credential for local dev
  if (process.env.FIREBASE_ADMIN_CREDENTIALS) {
    initializeApp({
      credential: cert(JSON.parse(process.env.FIREBASE_ADMIN_CREDENTIALS)),
      projectId,
    });
  } else {
    console.warn('No Firebase Admin credentials found, using dummy credential for development');
    initializeApp({
      projectId,
    });
  }
}

export const adminAuth = getAuth();
export const adminDb = getFirestore();
EOL

# Create login route
cat > src/app/api/auth/login/route.ts << 'EOL'
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { adminAuth, adminDb } from '@/lib/firebase-admin';

export async function POST(req: NextRequest) {
  try {
    const { idToken, returnTo } = await req.json();
    
    if (!idToken) {
      return NextResponse.json({ error: 'Missing ID token' }, { status: 400 });
    }
    
    // Verify Firebase ID token
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    
    // Get user from Firebase Auth
    const user = await adminAuth.getUser(decodedToken.uid);
    
    // Get user's roles from Firestore
    const userDoc = await adminDb.collection('bf_users').doc(user.uid).get();
    const roles = userDoc.exists ? (userDoc.data()?.roles || ['user']) : ['user'];
    
    // Create JWT token with user data
    const token = jwt.sign(
      {
        uid: user.uid,
        email: user.email,
        roles,
        displayName: user.displayName,
        photoURL: user.photoURL
      },
      process.env.JWT_SECRET as string,
      { expiresIn: process.env.JWT_EXPIRY || '12h' }
    );
    
    // Determine where to redirect (with token)
    if (returnTo) {
      const redirectUrl = new URL(returnTo);
      redirectUrl.searchParams.set('token', token);
      
      return NextResponse.redirect(redirectUrl.toString());
    }
    
    // If no returnTo URL is provided, just return the token
    return NextResponse.json({ token });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Authentication failed' }, { status: 401 });
  }
}
EOL

# Create token route
cat > src/app/api/auth/token/route.ts << 'EOL'
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { adminAuth, adminDb } from '@/lib/firebase-admin';

export async function POST(req: NextRequest) {
  try {
    const { idToken } = await req.json();
    
    if (!idToken) {
      return NextResponse.json({ error: 'Missing ID token' }, { status: 400 });
    }
    
    // Verify Firebase ID token
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    
    // Get user from Firebase Auth
    const user = await adminAuth.getUser(decodedToken.uid);
    
    // Get user's roles from Firestore
    const userDoc = await adminDb.collection('bf_users').doc(user.uid).get();
    const roles = userDoc.exists ? (userDoc.data()?.roles || ['user']) : ['user'];
    
    // Create JWT token with user data
    const token = jwt.sign(
      {
        uid: user.uid,
        email: user.email,
        roles,
        displayName: user.displayName,
        photoURL: user.photoURL
      },
      process.env.JWT_SECRET as string,
      { expiresIn: process.env.JWT_EXPIRY || '12h' }
    );
    
    return NextResponse.json({ token });
  } catch (error) {
    console.error('Token error:', error);
    return NextResponse.json({ error: 'Authentication failed' }, { status: 401 });
  }
}
EOL

# Create refresh route
cat > src/app/api/auth/refresh/route.ts << 'EOL'
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { adminDb } from '@/lib/firebase-admin';

interface JwtPayload {
  uid: string;
  email: string;
  roles?: string[];
  displayName?: string;
  photoURL?: string;
  exp: number;
  iat: number;
}

export async function POST(req: NextRequest) {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Missing or invalid token' }, { status: 401 });
    }
    
    const token = authHeader.split(' ')[1];
    
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
    
    // Get user's latest roles from Firestore
    const userDoc = await adminDb.collection('bf_users').doc(decoded.uid).get();
    const roles = userDoc.exists ? (userDoc.data()?.roles || ['user']) : ['user'];
    
    // Create a new token with latest roles and extended expiry
    const newToken = jwt.sign(
      {
        uid: decoded.uid,
        email: decoded.email,
        roles,
        displayName: decoded.displayName,
        photoURL: decoded.photoURL
      },
      process.env.JWT_SECRET as string,
      { expiresIn: process.env.JWT_EXPIRY || '12h' }
    );
    
    return NextResponse.json({ token: newToken });
  } catch (error) {
    console.error('Token refresh error:', error);
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }
}
EOL

# Create verify route
cat > src/app/api/auth/verify/route.ts << 'EOL'
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function POST(req: NextRequest) {
  try {
    const { token } = await req.json();
    
    if (!token) {
      return NextResponse.json({ error: 'Missing token' }, { status: 400 });
    }
    
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    
    return NextResponse.json({ valid: true, user: decoded });
  } catch (error) {
    console.error('Token verification error:', error);
    return NextResponse.json({ valid: false, error: 'Invalid token' }, { status: 401 });
  }
}
EOL

# Create logout route
cat > src/app/api/auth/logout/route.ts << 'EOL'
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { returnTo } = await req.json();
    
    // In a more complex implementation, you might want to invalidate tokens
    // or maintain a blacklist of logged-out tokens
    
    if (returnTo) {
      return NextResponse.redirect(returnTo);
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json({ error: 'Logout failed' }, { status: 500 });
  }
}
EOL

# Create .env.local.example file with necessary variables
cat > .env.local.example << 'EOL'
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id

# JWT Configuration
JWT_SECRET=your_secure_jwt_secret_here
JWT_EXPIRY=12h
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3002,https://bndy.live,https://my.bndy.co.uk

# Firebase Admin (optional for development)
# FIREBASE_ADMIN_CREDENTIALS={"type":"service_account","project_id":"...","private_key_id":"...","private_key":"...","client_email":"..."}
EOL

# Install required packages
echo "Running npm install for required packages..."
npm install jsonwebtoken firebase-admin

# Make script executable if creating on disk
chmod +x setup-auth-api.sh

echo "Authentication API routes setup complete!"
echo "Don't forget to add your JWT_SECRET to your .env.local file."