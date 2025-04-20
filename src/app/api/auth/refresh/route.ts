//path: src/app/api/auth/refresh/route.ts
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
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default-dev-secret') as JwtPayload;
    
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
      process.env.JWT_SECRET || 'default-dev-secret',
      { expiresIn: process.env.JWT_EXPIRY || '12h' }
    );
    
    return NextResponse.json({ token: newToken });
  } catch (error) {
    console.error('Token refresh error:', error);
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }
}