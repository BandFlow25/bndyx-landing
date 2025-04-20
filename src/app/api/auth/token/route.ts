//path: src/app/api/auth/token/route.ts
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
      process.env.JWT_SECRET || 'default-dev-secret',
      { expiresIn: process.env.JWT_EXPIRY || '12h' }
    );
    
    return NextResponse.json({ token });
  } catch (error) {
    console.error('Token error:', error);
    return NextResponse.json({ error: 'Authentication failed' }, { status: 401 });
  }
}