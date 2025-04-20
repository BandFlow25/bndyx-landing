// src/app/api/auth/login/route.ts
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { adminAuth, adminDb } from '@/lib/firebase-admin';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const idToken = searchParams.get('idToken');
    const returnTo = searchParams.get('returnTo');
    
    console.log(`Login API (GET) received: idToken exists: ${!!idToken}, returnTo: ${returnTo}`);
    
    if (!idToken) {
      return NextResponse.json({ error: 'Missing ID token' }, { status: 400 });
    }
    
    try {
      // Verify Firebase ID token
      console.log('Attempting to verify Firebase token...');
      const decodedToken = await adminAuth.verifyIdToken(idToken);
      console.log(`Token verified for user: ${decodedToken.uid}`);
      
      // Get user from Firebase Auth
      console.log('Fetching user from Firebase Auth...');
      const user = await adminAuth.getUser(decodedToken.uid);
      console.log(`User fetched: ${user.email}`);
      
      // Try to get user's roles from Firestore with error handling
      let roles = ['user']; // Default role
      try {
        console.log(`Attempting to fetch roles from Firestore for uid: ${user.uid}`);
        const userDoc = await adminDb.collection('bf_users').doc(user.uid).get();
        console.log(`Firestore document exists: ${userDoc.exists}`);
        
        if (userDoc.exists) {
          const userData = userDoc.data();
          console.log('User data from Firestore:', userData);
          roles = userData?.roles || ['user'];
        } else {
          console.log('No document found in Firestore, using default roles');
        }
      } catch (firestoreError) {
        console.error('Firestore error:', firestoreError);
        console.log('Using default roles due to Firestore error');
        
        // If godMode is in the firebase JWT, add it here in development
        if (process.env.NODE_ENV === 'development') {
          roles = ['user', 'live_giggoer']; // Default roles for development
          console.log('Using development roles:', roles);
        }
      }
      
      // Create JWT token with user data
      console.log('Creating JWT token with roles:', roles);
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
      
      // Determine where to redirect (with token)
      if (returnTo) {
        const redirectUrl = new URL(returnTo);
        redirectUrl.searchParams.set('token', token);
        
        console.log(`Redirecting to: ${redirectUrl.toString()}`);
        return NextResponse.redirect(redirectUrl.toString());
      }
      
      // If no returnTo URL provided, just return the token
      console.log('No returnTo URL provided, returning token in JSON response');
      return NextResponse.json({ token });
      
    } catch (firebaseError) {
      console.error('Firebase Auth error:', firebaseError);
      
      // DEVELOPMENT FALLBACK - Try to decode the token without verification
      if (process.env.NODE_ENV === 'development') {
        console.log('Development mode: Attempting to decode token without verification...');
        
        try {
          // Simple decode without verification (for development only!)
          const payload = JSON.parse(
            Buffer.from(idToken.split('.')[1], 'base64').toString()
          );
          
          console.log('Development mode: Token decoded successfully');
          console.log('User info from token:', {
            uid: payload.user_id || payload.sub,
            email: payload.email
          });
          
          // Create JWT token with basic user info from Firebase token
          const token = jwt.sign(
            {
              uid: payload.user_id || payload.sub,
              email: payload.email,
              roles: ['user', 'live_giggoer', 'GODMODE'], // Development roles
              displayName: payload.name || payload.email.split('@')[0],
              photoURL: null
            },
            process.env.JWT_SECRET || 'default-dev-secret',
            { expiresIn: process.env.JWT_EXPIRY || '12h' }
          );
          
          // Redirect with token
          if (returnTo) {
            const redirectUrl = new URL(returnTo);
            redirectUrl.searchParams.set('token', token);
            
            console.log(`Development mode: Redirecting to: ${redirectUrl.toString()}`);
            return NextResponse.redirect(redirectUrl.toString());
          }
          
          return NextResponse.json({ token });
        } catch (decodeError) {
          console.error('Development token decode error:', decodeError);
          return NextResponse.json({ error: 'Token decoding failed' }, { status: 401 });
        }
      }
      
      throw firebaseError; // Re-throw if not in development or if fallback fails
    }
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Authentication failed' }, { status: 401 });
  }
}

// POST handler with similar implementation
export async function POST(req: NextRequest) {
  try {
    const { idToken, returnTo } = await req.json();
    
    console.log(`Login API (POST) received: idToken exists: ${!!idToken}, returnTo: ${returnTo}`);
    
    // Very similar to GET handler, can reuse most of the logic
    // ...

    return NextResponse.json({ error: 'Not implemented' }, { status: 501 });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Authentication failed' }, { status: 401 });
  }
}