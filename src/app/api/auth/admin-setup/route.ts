import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase-admin';

// This is a development-only endpoint to set up admin users
// In production, this would be protected by authentication
export async function GET(req: NextRequest) {
  try {
    // Only allow this in development mode
    if (process.env.NODE_ENV !== 'development') {
      return NextResponse.json({ error: 'This endpoint is only available in development mode' }, { status: 403 });
    }

    const adminEmails = ['jason@jjones.work', 'jason@leandevsystems.co.uk'];
    const results = [];

    // Find users by email and set their custom claims
    for (const email of adminEmails) {
      try {
        console.log(`Looking up user with email: ${email}`);
        const userRecord = await adminAuth.getUserByEmail(email);
        
        if (userRecord) {
          console.log(`Found user: ${userRecord.uid}`);
          
          // Set admin roles in custom claims
          const adminRoles = ['user', 'admin', 'bndy_admin', 'GODMODE'];
          
          // Get current custom claims
          const currentClaims = userRecord.customClaims || {};
          
          // Set the custom claims
          await adminAuth.setCustomUserClaims(userRecord.uid, {
            ...currentClaims,
            roles: adminRoles,
            godMode: true,
            // Add a timestamp to force token refresh
            updated_at: new Date().getTime()
          });
          
          console.log(`Set custom claims for ${email}`);
          
          // Also update the user document in Firestore
          try {
            // Check users collection first
            const userDoc = await adminDb.collection('users').doc(userRecord.uid).get();
            
            if (userDoc.exists) {
              await adminDb.collection('users').doc(userRecord.uid).update({
                roles: adminRoles,
                godMode: true,
                updatedAt: new Date()
              });
              console.log(`Updated user document in 'users' collection for ${email}`);
            } else {
              // Try bf_users collection
              const bfUserDoc = await adminDb.collection('bf_users').doc(userRecord.uid).get();
              
              if (bfUserDoc.exists) {
                await adminDb.collection('bf_users').doc(userRecord.uid).update({
                  roles: adminRoles,
                  godMode: true,
                  updatedAt: new Date()
                });
                console.log(`Updated user document in 'bf_users' collection for ${email}`);
              } else {
                // Create a new document in users collection
                await adminDb.collection('users').doc(userRecord.uid).set({
                  email: email,
                  roles: adminRoles,
                  godMode: true,
                  createdAt: new Date(),
                  updatedAt: new Date()
                });
                console.log(`Created new user document in 'users' collection for ${email}`);
              }
            }
          } catch (firestoreError) {
            console.error(`Error updating Firestore for ${email}:`, firestoreError);
          }
          
          results.push({
            email,
            uid: userRecord.uid,
            success: true,
            message: 'Admin roles set successfully'
          });
        }
      } catch (error: any) {
        console.error(`Error setting admin roles for ${email}:`, error);
        results.push({
          email,
          success: false,
          error: error.message
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Admin setup process completed',
      results
    });
  } catch (error: any) {
    console.error('Error in admin setup:', error);
    return NextResponse.json({ 
      error: 'Failed to set up admin users', 
      message: error.message 
    }, { status: 500 });
  }
}
