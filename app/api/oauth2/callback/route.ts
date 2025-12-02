import { NextResponse } from 'next/server';
import oauth2Client from '@/app/utils/google-auth';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');

  // Public host (ngrok or production)
  const baseUrl = process.env.NEXT_PUBLIC_HOST!;
  if (!baseUrl) {
    console.error('NEXT_PUBLIC_HOST is not set!');
    return NextResponse.redirect(new URL('/', 'https://localhost')); // fallback
  }

  if (!code) {
    return NextResponse.redirect(new URL('/?error=no_code', baseUrl));
  }

  try {
    const { tokens } = await oauth2Client.getToken({
      code,
      redirect_uri: process.env.REDIRECT_URI, // should match OAuth app config
    });

    console.log('TOKENS RECEIVED ✅', tokens);

    (await cookies()).set('google_tokens', JSON.stringify(tokens), {
      httpOnly: true,
      secure: true, // must be true for HTTPS (ngrok or production)
      path: '/',
      maxAge: 60 * 60 * 24 * 60, // 60 days
    });

    return NextResponse.redirect(new URL('/dashboard', baseUrl));
  } catch (err: any) {
    console.error('FINAL ERROR:', err.response?.data || err.message);
    return NextResponse.redirect(new URL('/?error=token_failed', baseUrl));
  }
}
