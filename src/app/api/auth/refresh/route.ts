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
    
    // Define proper type for user data to avoid TypeScript errors
    interface UserData {
      roles?: string[] | string;
      displayName?: string | null;
      photoURL?: string | null;
      godMode?: boolean;
      hasProfile?: boolean;
      [key: string]: any; // Allow for any other properties
    }
    
    // Default to user role
    let roles = ['user'];
    let userData: UserData = {};
    let godMode = false;
    
    if (userDoc.exists) {
      userData = userDoc.data() || {};
      console.log('FIREBASE DEBUG: Complete user data from Firestore:', userData);
      
      // Check for godMode flag
      if (userData.godMode === true) {
        godMode = true;
        console.log('FIREBASE DEBUG: User has godMode privileges');
      }
      
      // Process roles from userData
      if (userData.roles) {
        const rolesData = userData.roles;
        console.log('FIREBASE DEBUG: Raw roles from bf_users:', rolesData);
        
        if (Array.isArray(rolesData)) {
          console.log('FIREBASE DEBUG: Roles is an array with length:', rolesData.length);
          
          if (rolesData.length > 0) {
            // Enhanced array handling for different formats
            roles = rolesData.map((role: any) => {
              if (typeof role === 'string') {
                // Direct string format: ["admin", "bndy_artist"]
                return role;
              } else if (typeof role === 'object' && role !== null) {
                // Handle object format if present
                const key = Object.keys(role)[0];
                return key || 'user';
              }
              return String(role); // Fallback conversion
            });
            console.log('FIREBASE DEBUG: Processed roles array:', roles);
          }
        } else if (typeof rolesData === 'string') {
          console.log('FIREBASE DEBUG: Roles is a string:', rolesData);
          roles = [rolesData];
        } else if (typeof rolesData === 'object' && rolesData !== null) {
          console.log('FIREBASE DEBUG: Roles is an object:', rolesData);
          // Handle object-style roles (e.g., {admin: true, user: true})
          const roleArray = Object.keys(rolesData).filter(key => rolesData[key] === true);
          if (roleArray.length > 0) {
            roles = roleArray;
          }
        }
        
        console.log('FIREBASE DEBUG: Final processed roles:', roles);
      }
    }
    
    // Prepare the token payload
    const tokenPayload = {
      uid: decoded.uid,
      email: decoded.email,
      roles,
      displayName: decoded.displayName || (userData?.displayName) || null,
      photoURL: decoded.photoURL || (userData?.photoURL) || null,
      godMode,  // Include godMode flag from Firestore
    };

    console.log('🔥 REFRESH API: Final token payload:', tokenPayload);
    
    // Create a new token with latest roles and extended expiry
    const newToken = jwt.sign(
      tokenPayload,
      process.env.JWT_SECRET || 'default-dev-secret',
      { expiresIn: process.env.JWT_EXPIRY || '12h' }
    );
    
    // Verify the new token
    try {
      const verifiedToken = jwt.verify(newToken, process.env.JWT_SECRET || 'default-dev-secret');
      console.log('🔥 REFRESH API: Verified new token payload:', verifiedToken);
      if (verifiedToken.roles) {
        console.log('🔥 REFRESH API: Roles in new token:', verifiedToken.roles);
      }
    } catch (verifyErr) {
      console.error('🔥 REFRESH API: Token verification error:', verifyErr);
    }
    
    // Verify token before returning
    try {
      const verifiedToken = jwt.verify(newToken, process.env.JWT_SECRET || 'default-dev-secret');
      console.log('FIREBASE DEBUG: Verified refreshed token payload:', verifiedToken);
    } catch (verifyErr) {
      console.error('Token verification error:', verifyErr);
    }
    
    return NextResponse.json({ token: newToken });
  } catch (error) {
    console.error('Token refresh error:', error);
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }
}