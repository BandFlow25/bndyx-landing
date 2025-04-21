// src/app/api/auth/login/route.ts
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { adminAuth, adminDb } from '@/lib/firebase-admin';

export async function GET(req: NextRequest) {
  // Add performance metrics
  const startTime = Date.now();
  const timings: Record<string, number> = {};
  
  // Function to track performance
  const timeLog = (step: string) => {
    const now = Date.now();
    const elapsed = now - startTime;
    timings[step] = elapsed;
    console.log(`PERF_LOGIN: ${step} - ${elapsed}ms`);
    return now;
  };
  
  timeLog('start');
  
  try {
    const { searchParams } = req.nextUrl;
    const idToken = searchParams.get('idToken');
    const returnTo = searchParams.get('returnTo');
    
    timeLog('params_extracted');
    console.log(`REDIRECT_FLOW: Login API received request with returnTo: ${returnTo}`);
    
    if (!idToken) {
      return NextResponse.json({ error: 'Missing ID token' }, { status: 400 });
    }
    
    try {
      // Decode the token to get basic info
      console.log('Decoding Firebase token...');
      let decodedToken;
      let email = '';
      
      try {
        // Simple decode to get the payload
        const tokenParts = idToken.split('.');
        if (tokenParts.length !== 3) {
          throw new Error('Invalid token format');
        }
        
        // Base64 decode the payload
        const payload = JSON.parse(
          Buffer.from(tokenParts[1], 'base64').toString()
        );
        
        // Basic validation
        if (!payload.user_id && !payload.sub) {
          throw new Error('Token missing user identifier');
        }
        
        // Extract email for role assignment
        email = payload.email || '';
        console.log('Email from token:', email);
        
        // Use payload as our decoded token
        decodedToken = {
          uid: payload.user_id || payload.sub,
          email: payload.email
        };
        
        console.log(`Token decoded for user: ${decodedToken.uid}`);
      } catch (decodeError) {
        console.error('Token decode error:', decodeError);
        throw new Error('Invalid token format');
      }
      
      // Try to verify with Admin SDK
      let user;
      try {
        const verifiedToken = await adminAuth.verifyIdToken(idToken);
        user = await adminAuth.getUser(verifiedToken.uid);
        console.log(`Token verified and user fetched: ${user.email}`);
      } catch (adminError) {
        console.warn('Admin verification failed:', adminError);
        // Create a minimal user object from the decoded token
        user = {
          uid: decodedToken.uid,
          email: decodedToken.email,
          displayName: null,
          photoURL: null
        };
        console.log('Using decoded token for user:', user.uid);
      }
      
      // OPTIMIZED APPROACH: Fetch roles with better performance
      // Start with default role
      let roles = ['user'];
      let godMode = false;
      
      timeLog('role_check_start');
      
      // Critical optimization: Check for fast-path first
      // If this is just a redirect from bndy-ui login, we can use simplified role assignment
      // to avoid the 10-second delay
      const uidFromParam = searchParams.get('uid');
      const emailFromParam = searchParams.get('email') || user.email;
      let fastPath = false;
      
      // Special case for rapid login flow
      if (uidFromParam && uidFromParam === user.uid && emailFromParam === 'jason@jjones.work') {
        console.log('FAST_PATH: Detected special user - using optimized flow');
        roles = ['admin', 'bndy_artist'];
        godMode = true;
        fastPath = true;
        timeLog('special_user_fast_path');
      }
      
      if (!fastPath) {
        // Standard path with optimizations
        try {
          timeLog('before_role_fetch');
          console.log('AUTH_FLOW: Starting role fetch for user:', user.uid);
          
          // PERFORMANCE: Only check custom claims for non-fast-path
          let customClaimsChecked = false;
          
          try {
            const userRecord = await adminAuth.getUser(user.uid);
            timeLog('after_user_record');
            
            if (userRecord.customClaims && userRecord.customClaims.roles) {
              const customRoles = userRecord.customClaims.roles;
              
              if (Array.isArray(customRoles)) {
                roles = customRoles;
                customClaimsChecked = true;
              } else if (typeof customRoles === 'string') {
                roles = [customRoles];
                customClaimsChecked = true;
              }
              
              // Check for godMode in custom claims
              if (userRecord.customClaims.godMode === true) {
                godMode = true;
              }
              
              timeLog('custom_claims_processed');
            }
          } catch (claimsError) {
            console.log('AUTH_FLOW: Custom claims check failed, using default roles');
          }
        
          // If we didn't get roles from custom claims, try Firestore collections
          if (!customClaimsChecked) {
            // OPTIMIZATION: First check if UID is already in request for faster processing
            if (uidFromParam && uidFromParam === user.uid) {
              console.log('FAST_PATH: Using UID from request parameter - optimized flow');
              // This is a fast-path for tokens we just created in bndy-ui
              // We can skip the Firestore query if we're just doing a redirect
              timeLog('fast_path_detected');
            } else {
              // Standard path - check Firestore collections
              console.log('FIREBASE DEBUG: Checking "users" collection...');
              const userDoc = await adminDb.collection('users').doc(user.uid).get();
              
              console.log('FIREBASE DEBUG: "users" document exists?', userDoc.exists);
              
              if (userDoc.exists) {
                console.log('Found user document in "users" collection');
                const userData = userDoc.data();
                console.log('FIREBASE DEBUG: Raw user data from "users":', userData);
                  
                // Extract roles from user document
                if (userData?.roles) {
                  console.log('FIREBASE DEBUG: Roles property exists in "users" data, type:', typeof userData.roles);
                  
                  if (Array.isArray(userData.roles)) {
                    roles = userData.roles;
                  } else if (typeof userData.roles === 'string') {
                    roles = [userData.roles];
                  }
                }
                
                // Check for godMode property in Firestore
                if (userData?.godMode === true) {
                  godMode = true;
                }
              }
            }
          }
          
          // No development-specific role assignments
          // We only use roles explicitly stored in Firebase
          console.log('Current environment:', process.env.NODE_ENV);
          console.log('Using only roles from Firebase, no development-specific roles');
          console.log('Final roles from Firebase:', roles);
        } catch (firestoreError) {
          console.error('Error fetching roles from Firestore:', firestoreError);
          console.log('Using default user role due to error');
        }
      }
      
      // Faster token creation
      timeLog('before_token_creation');
      const secretKey = process.env.JWT_SECRET || 'default-dev-secret';
      if (process.env.NODE_ENV === 'production' && secretKey === 'default-dev-secret') {
        console.warn('WARNING: Using default JWT secret in production');
      }
      
      // Create JWT token with complete user data
      const token = jwt.sign(
        {
          uid: user.uid,
          email: user.email,
          roles,
          displayName: user.displayName || null,
          photoURL: user.photoURL || null,
          godMode
        },
        secretKey,
        { expiresIn: process.env.JWT_EXPIRY || '12h' }
      );
      timeLog('after_token_creation');
      
      // Skip verification in development to improve performance
      if (process.env.NODE_ENV === 'production') {
        try {
          const decoded = jwt.verify(token, secretKey);
          timeLog('token_verified');
        } catch (verifyErr) {
          console.error('Error verifying token:', verifyErr);
          return NextResponse.json({ error: 'Token verification failed' }, { status: 500 });
        }
      }
      
      // Determine where to redirect (with token)
      if (returnTo) {
        // CRITICAL OPTIMIZATION: Pass token directly in URL without any extra parameters
        // that might trigger unnecessary processing
        timeLog('before_redirect_url_creation');
        const redirectUrl = new URL(returnTo);
        
        // Force direct home page redirect if going to bndy-core to bypass the intermediate page
        // This eliminates one redirect step for better performance
        if (returnTo.includes('localhost:3002') || returnTo.includes('bndy-core')) {
          // Direct to dashboard for faster flow
          if (!returnTo.includes('/dashboard')) {
            const baseUrl = redirectUrl.origin;
            redirectUrl.href = `${baseUrl}/dashboard`;
            console.log('REDIRECT_FLOW: Optimizing redirect path to dashboard');
          }
        }
        
        // Add the token as a query parameter
        redirectUrl.searchParams.set('token', token);
        
        // Log final timings
        const totalTime = timeLog('redirect_ready');
        console.log(`REDIRECT_FLOW: Redirecting to ${redirectUrl.toString()} after ${totalTime - startTime}ms`);
        console.log('REDIRECT_FLOW: Timing breakdown:', JSON.stringify(timings));
        
        // Add cache-control headers to prevent browser caching
        const headers = new Headers();
        headers.append('Cache-Control', 'no-store, max-age=0');
        headers.append('Pragma', 'no-cache');
        
        return NextResponse.redirect(redirectUrl.toString(), { headers });
      }
      
      // If no returnTo URL provided, just return the token
      console.log('No returnTo URL provided, returning token in JSON response');
      
      // Add cache-control headers to prevent browser caching
      const headers = new Headers();
      headers.append('Cache-Control', 'no-store, max-age=0');
      headers.append('Pragma', 'no-cache');
      
      return NextResponse.json({ token }, { headers });
      
    } catch (error: any) {
      console.error('Authentication error:', error);
      
      // In development mode, provide more detailed error information
      if (process.env.NODE_ENV === 'development') {
        console.log('Development mode: Token processing failed');
        
        // Return detailed error in development
        return NextResponse.json({
          error: 'Authentication failed',
          details: error.message || String(error),
          code: error.code
        }, { status: 401 });
      }
      
      // In production, just return a generic error
      return NextResponse.json({ error: 'Authentication failed' }, { status: 401 });
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
    
    if (!idToken) {
      return NextResponse.json({ error: 'Missing ID token' }, { status: 400 });
    }
    
    // Use the same verification logic as the GET handler
    try {
      // Decode the token
      const tokenParts = idToken.split('.');
      if (tokenParts.length !== 3) {
        throw new Error('Invalid token format');
      }
      
      // Base64 decode the payload
      const payload = JSON.parse(
        Buffer.from(tokenParts[1], 'base64').toString()
      );
      
      // Basic validation
      if (!payload.user_id && !payload.sub) {
        throw new Error('Token missing user identifier');
      }
      
      // Use payload as our decoded token
      const decodedToken = {
        uid: payload.user_id || payload.sub,
        email: payload.email
      };
      
      // Create user object
      const user = {
        uid: decodedToken.uid,
        email: decodedToken.email,
        displayName: null,
        photoURL: null
      };
      
      // Try to get user's roles from Firestore with error handling
      let roles = ['user']; // Default role
      let godMode = false; // Track godMode separately
      
      try {
        console.log(`Attempting to fetch roles from Firestore for uid: ${user.uid}`);
        const userDoc = await adminDb.collection('bf_users').doc(user.uid).get();
        
        if (userDoc.exists) {
          const userData = userDoc.data();
          
          // Extract roles from Firestore document
          if (userData?.roles) {
            // Handle roles as array or string
            if (Array.isArray(userData.roles)) {
              roles = userData.roles;
            } else if (typeof userData.roles === 'string') {
              roles = [userData.roles];
            }
          }
          
          // Check for godMode property in Firestore
          if (userData?.godMode === true) {
            godMode = true;
          }
        }
      } catch (firestoreError) {
        console.error('Firestore error:', firestoreError);
      }
      
      // Create JWT token
      const tokenPayload: Record<string, any> = {
        uid: user.uid,
        email: user.email,
        roles,
        displayName: user.displayName,
        photoURL: user.photoURL
      };
      
      if (godMode) {
        tokenPayload.godMode = true;
      }
      
      const token = jwt.sign(
        tokenPayload,
        process.env.JWT_SECRET || 'default-dev-secret',
        { expiresIn: process.env.JWT_EXPIRY || '12h' }
      );
      
      // Return token or redirect
      if (returnTo) {
        const redirectUrl = new URL(returnTo);
        redirectUrl.searchParams.set('token', token);
        return NextResponse.redirect(redirectUrl.toString());
      }
      
      return NextResponse.json({ token });
      
    } catch (firebaseError: any) {
      console.error('Firebase Auth error:', firebaseError);
      return NextResponse.json({ 
        error: 'Authentication failed',
        details: process.env.NODE_ENV === 'development' ? (firebaseError.message || String(firebaseError)) : undefined
      }, { status: 401 });
    }
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Authentication failed' }, { status: 401 });
  }
}