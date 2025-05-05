//path: src/app/api/auth/token/route.ts
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { adminAuth, adminDb } from '@/lib/firebase-admin';

// Import centralized types from bndy-types
import type { FirestoreUserData, TokenPayload, UserRole } from 'bndy-types';

/**
 * Helper function to create a token payload with proper types
 */
async function createTokenPayload(
  user: any,
  forceOverride = false
): Promise<TokenPayload> {
  // Add performance tracking
  const startTime = Date.now();
  const trackTime = (step: string) => {
    const elapsed = Date.now() - startTime;
    console.log(`PERF_PAYLOAD: ${step} - ${elapsed}ms`);
    return elapsed;
  };
  
  trackTime('start');
  
  // Default values
  let roles: UserRole[] = ['user' as UserRole];
  let godMode = false;
  
  // Skip special case handling - all users should go through the standard flow
  if (forceOverride) {
    console.log('AUTH_FLOW: Force override requested - skipping standard flow');
    const payload: TokenPayload = {
      uid: user.uid,
      email: user.email,
      roles: roles, // Use default roles
      displayName: user.displayName,
      photoURL: user.photoURL,
      godMode: false // No special privileges by default
    };
    console.log(`AUTH_FLOW: Override completed in ${trackTime('override_complete')}ms`);
    return payload;
  }
  
  // For other users, get data from Firestore
  try {
    trackTime('before_firestore_query');
    console.log(`AUTH_FLOW: Fetching Firestore data for user ${user.uid}`);
    const userDoc = await adminDb.collection('bf_users').doc(user.uid).get();
    trackTime('after_firestore_query');
    
    if (userDoc.exists) {
      const userData = userDoc.data() as FirestoreUserData;
      
      // Process roles
      if (userData.roles) {
        if (Array.isArray(userData.roles)) {
          // Convert string roles to UserRole type
          roles = userData.roles.map(r => typeof r === 'string' ? r as UserRole : String(r) as UserRole);
        } else if (typeof userData.roles === 'string') {
          roles = [userData.roles as UserRole];
        } else if (typeof userData.roles === 'object' && userData.roles !== null) {
          // Fixed type issue - ensure we're dealing with a Record<string, boolean>
          const roleObj = userData.roles as Record<string, boolean>;
          roles = Object.keys(roleObj).filter(k => roleObj[k] === true).map(r => r as UserRole);
        }
      }
      
      // Process godMode
      if (userData.godMode === true) {
        godMode = true;
      }
      
      const payload: TokenPayload = {
        uid: user.uid,
        email: user.email,
        roles,
        displayName: user.displayName || userData.displayName || null,
        photoURL: user.photoURL || userData.photoURL || null,
        godMode
      };
      console.log(`AUTH_FLOW: Firestore data processed in ${trackTime('firestore_data_processed')}ms`);
      return payload;
    }
  } catch (error) {
    console.error('AUTH_FLOW: Error fetching user data from Firestore:', error);
    trackTime('firestore_error');
  }
  
  // Fallback if Firestore fetch fails
  console.log(`AUTH_FLOW: Using fallback token payload after ${trackTime('fallback_used')}ms`);
  return {
    uid: user.uid,
    email: user.email,
    roles, // Already typed as UserRole[] from the default value
    displayName: user.displayName || null,
    photoURL: user.photoURL || null,
    godMode
  } as TokenPayload;
}

export async function POST(req: NextRequest) {
  // Add performance tracking
  const startTime = Date.now();
  const timings: Record<string, number> = {};
  
  const timeLog = (step: string) => {
    const now = Date.now();
    const elapsed = now - startTime;
    timings[step] = elapsed;
    console.log(`PERF_TOKEN: ${step} - ${elapsed}ms`);
    return now;
  };
  
  timeLog('start');
  console.log('AUTH_FLOW: Token API process started');
  
  try {
    const { idToken } = await req.json();
    timeLog('json_parsed');
    
    if (!idToken) {
      return NextResponse.json({ error: 'Missing ID token' }, { status: 400 });
    }
    
    // This step is often slow - measure it
    console.log('AUTH_FLOW: Verifying Firebase ID token');
    timeLog('before_token_verify');
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    timeLog('after_token_verify');

    // Get user from Firebase Auth - can also be slow
    console.log('AUTH_FLOW: Getting user data for UID:', decodedToken.uid);
    timeLog('before_get_user');
    const user = await adminAuth.getUser(decodedToken.uid);
    timeLog('after_get_user');

    // Create a payload for this user - potential slowdown
    timeLog('before_create_payload');
    let tokenPayload: TokenPayload = await createTokenPayload(user);
    timeLog('after_create_payload');

    // Set the secret key for JWT token
    const secretKey = process.env.JWT_SECRET || 'default-dev-secret';
    if (process.env.NODE_ENV === 'production' && secretKey === 'default-dev-secret') {
      console.warn('WARNING: Using default JWT secret in production');
    }

    console.log('🔥 TOKEN API: Initial token payload structure:', {
      uid: tokenPayload.uid,
      email: tokenPayload.email,
      roles: tokenPayload.roles,
      displayName: tokenPayload.displayName,
      godMode: tokenPayload.godMode
    });
    
    // No special case handling - roles should be determined by database
    // Log the final token payload for debugging
    console.log('TOKEN API: Final payload:', tokenPayload);

    console.log('AUTH_FLOW: Payload ready, creating JWT token');
    
    // Create JWT token with complete user data
    timeLog('before_token_sign');
    const token = jwt.sign(
      tokenPayload,
      secretKey,
      { expiresIn: process.env.JWT_EXPIRY || '12h' }
    );
    timeLog('after_token_sign');
    
    // Verify token before returning - this might be unnecessary and causing delay
    timeLog('before_token_verify');
    try {
      const decoded = jwt.verify(token, secretKey) as TokenPayload;
      console.log('🔥 TOKEN API: FINAL DECODED TOKEN:', JSON.stringify(decoded, null, 2));
      
      // Extra verification of the roles in the token
      if (Array.isArray(decoded.roles)) {
        console.log('🔥 TOKEN API: VERIFIED ROLES IN TOKEN:', decoded.roles);
        console.log('🔥 TOKEN API: GODMODE IN TOKEN:', decoded.godMode);
      } else {
        console.log('🔥 TOKEN API: WARNING - Roles in verified token are not an array:', decoded.roles);
      }
    } catch (verifyErr) {
      console.error('🔥 TOKEN API: Token verification error:', verifyErr);
    }
    
    // Log performance summary
    const totalTime = timeLog('response_ready');
    console.log(`AUTH_FLOW: Token generated in ${totalTime - startTime}ms`);
    console.log('AUTH_FLOW: Performance breakdown:', JSON.stringify(timings));
    
    return NextResponse.json({ token });
  } catch (error: any) {
    console.error('Token generation error:', error);
    return NextResponse.json({ error: 'Authentication failed' }, { status: 401 });
  }
}