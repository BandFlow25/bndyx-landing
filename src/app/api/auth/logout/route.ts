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

// Also support GET for URL-based logout
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const returnTo = searchParams.get('returnTo');
    
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