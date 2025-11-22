// app/api/oauth2/callback/route.ts 

import { NextResponse } from 'next/server';
import oauth2Client from '@/app/utils/google-auth';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');

  if (!code) return NextResponse.redirect(new URL('/?error=no_code', request.url));

  try {
    const { tokens } = await oauth2Client.getToken({
      code,
      redirect_uri: process.env.REDIRECT_URI,  
    });
    /*'http://localhost:3000/api/oauth2/callback'*/ // ← hard-coded alternative

    console.log('TOKENS RECEIVED ✅', tokens);   // ← you will see this

    (await cookies()).set('google_tokens', JSON.stringify(tokens), {
      httpOnly: true,
      secure: false,
      path: '/',
      maxAge: 60 * 60 * 24 * 60, // 60 days for refresh token
    });

    return NextResponse.redirect(new URL('/dashboard', request.url));
  } catch (err: any) {
    console.error('FINAL ERROR:', err.response?.data || err.message);
    return NextResponse.redirect(new URL('/?error=token_failed', request.url));
  }
} 
