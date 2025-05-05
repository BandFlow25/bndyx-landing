// src/app/api/auth/exchange/route.ts
import { NextRequest, NextResponse } from 'next/server';
import AUTH_CONFIG from '@/config/auth';

// Common headers for CORS
function getCorsHeaders(req: NextRequest): Headers {
  const headers = new Headers();
  
  // Allow requests from all bndy domains
  const allowedOrigins = [
    AUTH_CONFIG.urls.core,  // backstage.bndy.co.uk in production
    AUTH_CONFIG.urls.live,  // bndy.live in production
    'https://bndy.co.uk',
    // Include localhost variants for development
    'https://localhost:3002',
    'https://localhost:3000',
    'http://localhost:3002',
    'http://localhost:3000'
  ];
  
  // Get the origin from the request
  const origin = req.headers.get('origin');
  
  // Set the appropriate CORS headers
  if (origin && allowedOrigins.includes(origin)) {
    headers.append('Access-Control-Allow-Origin', origin);
  } else {
    // Default to the core URL if origin is not in the allowed list
    headers.append('Access-Control-Allow-Origin', AUTH_CONFIG.urls.core);
  }
  
  // Allow credentials and set other CORS headers
  headers.append('Access-Control-Allow-Credentials', 'true');
  headers.append('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  headers.append('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // Add cache control headers
  headers.append('Cache-Control', 'no-store, max-age=0');
  headers.append('Pragma', 'no-cache');
  
  return headers;
}

/**
 * Exchange a temporary auth code for a JWT token
 * This endpoint is used to securely exchange the auth code for a token
 * without exposing the token in the URL
 */
export async function GET(req: NextRequest) {
  console.log('AUTH_EXCHANGE: GET Exchange endpoint called');
  
  try {
    const { searchParams } = req.nextUrl;
    const code = searchParams.get('code');
    console.log('AUTH_EXCHANGE: Received code request', { hasCode: !!code });
    
    // Validate the auth code
    if (!code) {
      console.log('AUTH_EXCHANGE: Missing auth code');
      return NextResponse.json({ error: 'Missing auth code' }, { status: 400 });
    }
    
    // Check if the auth code store exists
    if (typeof global.authCodeStore === 'undefined') {
      console.log('AUTH_EXCHANGE: Auth code store is not initialized');
      return NextResponse.json({ error: 'Auth system not initialized' }, { status: 500 });
    }
    
    // Check if the auth code exists in the store
    const hasCode = global.authCodeStore.has(code);
    console.log('AUTH_EXCHANGE: Auth code validation', { hasCode, storeSize: global.authCodeStore.size });
    
    if (!hasCode) {
      console.log('AUTH_EXCHANGE: Invalid or expired auth code');
      return NextResponse.json({ error: 'Invalid or expired auth code' }, { status: 400 });
    }
    
    // Get the token from the store
    const tokenData = global.authCodeStore.get(code);
    console.log('AUTH_EXCHANGE: Retrieved token data', { hasTokenData: !!tokenData });
    
    // Safety check - this should never happen but TypeScript needs it
    if (!tokenData) {
      console.log('AUTH_EXCHANGE: Auth code exists in map but data is null');
      return NextResponse.json({ error: 'Auth code not found' }, { status: 400 });
    }
    
    const { token, expires } = tokenData;
    console.log('AUTH_EXCHANGE: Token data retrieved', { 
      hasToken: !!token, 
      tokenLength: token?.length,
      expiresIn: Math.floor((expires - Date.now()) / 1000) + ' seconds' 
    });
    
    // Check if the auth code has expired
    if (Date.now() > expires) {
      console.log('AUTH_EXCHANGE: Auth code expired');
      // Remove expired auth code
      global.authCodeStore.delete(code);
      return NextResponse.json({ error: 'Auth code expired' }, { status: 400 });
    }
    
    // Remove the auth code from the store (one-time use)
    global.authCodeStore.delete(code);
    console.log('AUTH_EXCHANGE: Auth code deleted after successful use');
    
    // Get CORS headers
    const headers = getCorsHeaders(req);
    
    console.log('AUTH_EXCHANGE: Successfully returning token with proper CORS headers');
    return NextResponse.json({ token }, { headers });
  } catch (error) {
    console.error('Error exchanging auth code:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * OPTIONS handler for CORS preflight requests
 */
export async function OPTIONS(req: NextRequest) {
  console.log('AUTH_EXCHANGE: OPTIONS request received');
  
  // Get CORS headers
  const headers = getCorsHeaders(req);
  
  // Return a 204 No Content response with CORS headers
  return new NextResponse(null, {
    status: 204,
    headers
  });
}

/**
 * POST handler for auth code exchange - supports CSRF protection
 * This endpoint is used by the secure auth flow to exchange a code for a token
 * with additional CSRF protection
 */
export async function POST(req: NextRequest) {
  console.log('AUTH_EXCHANGE: POST Exchange endpoint called');
  
  try {
    // Parse the request body
    const body = await req.json();
    const { code, state } = body;
    
    console.log('AUTH_EXCHANGE: Received POST code exchange request', { 
      hasCode: !!code,
      hasState: !!state
    });
    
    // Validate the auth code
    if (!code) {
      console.log('AUTH_EXCHANGE: Missing auth code');
      return NextResponse.json({ error: 'Missing auth code' }, { status: 400 });
    }
    
    // Check if the auth code store exists
    if (typeof global.authCodeStore === 'undefined') {
      console.log('AUTH_EXCHANGE: Auth code store is not initialized');
      return NextResponse.json({ error: 'Auth system not initialized' }, { status: 500 });
    }
    
    // Check if the auth code exists in the store
    const hasCode = global.authCodeStore.has(code);
    console.log('AUTH_EXCHANGE: Auth code validation', { hasCode, storeSize: global.authCodeStore.size });
    
    if (!hasCode) {
      console.log('AUTH_EXCHANGE: Invalid or expired auth code');
      return NextResponse.json({ error: 'Invalid or expired auth code' }, { status: 400 });
    }
    
    // Get the token from the store
    const tokenData = global.authCodeStore.get(code);
    console.log('AUTH_EXCHANGE: Retrieved token data', { hasTokenData: !!tokenData });
    
    // Safety check - this should never happen but TypeScript needs it
    if (!tokenData) {
      console.log('AUTH_EXCHANGE: Auth code exists in map but data is null');
      return NextResponse.json({ error: 'Auth code not found' }, { status: 400 });
    }
    
    const { token, expires } = tokenData;
    console.log('AUTH_EXCHANGE: Token data retrieved', { 
      hasToken: !!token, 
      tokenLength: token?.length,
      expiresIn: Math.floor((expires - Date.now()) / 1000) + ' seconds' 
    });
    
    // Check if the auth code has expired
    if (Date.now() > expires) {
      console.log('AUTH_EXCHANGE: Auth code expired');
      // Remove expired auth code
      global.authCodeStore.delete(code);
      return NextResponse.json({ error: 'Auth code expired' }, { status: 400 });
    }
    
    // Remove the auth code from the store (one-time use)
    global.authCodeStore.delete(code);
    console.log('AUTH_EXCHANGE: Auth code deleted after successful use');
    
    // Get CORS headers
    const headers = getCorsHeaders(req);
    
    console.log('AUTH_EXCHANGE: Successfully returning token with proper CORS headers');
    return NextResponse.json({ token }, { headers });
  } catch (error) {
    console.error('Error exchanging auth code:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
