import { NextRequest, NextResponse } from 'next/server';
import { adminAuth } from '@/lib/firebase-admin';

// Admin-only endpoint to set custom claims for a user
export async function POST(req: NextRequest) {
  try {
    // This should be protected with proper authentication in production
    // For now, we'll use a simple API key check for demonstration
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const apiKey = authHeader.split('Bearer ')[1];
    // Simple check - in production, use a proper API key validation
    if (apiKey !== process.env.ADMIN_API_KEY && process.env.NODE_ENV !== 'development') {
      return NextResponse.json({ error: 'Invalid API key' }, { status: 401 });
    }

    const { uid, roles, godMode = false } = await req.json();

    if (!uid) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    if (!roles || !Array.isArray(roles)) {
      return NextResponse.json({ error: 'Roles must be an array' }, { status: 400 });
    }

    console.log(`Setting custom claims for user ${uid}:`, { roles, godMode });

    // Get current custom claims
    const user = await adminAuth.getUser(uid);
    const currentClaims = user.customClaims || {};

    // Set the custom claims
    await adminAuth.setCustomUserClaims(uid, {
      ...currentClaims,
      roles,
      godMode,
      // Add a timestamp to force token refresh
      updated_at: new Date().getTime()
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Custom claims set successfully',
      uid,
      roles,
      godMode
    });
  } catch (error: any) {
    console.error('Error setting custom claims:', error);
    return NextResponse.json({ 
      error: 'Failed to set custom claims', 
      message: error.message 
    }, { status: 500 });
  }
}
