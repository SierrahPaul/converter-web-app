// app/api/youtube/create-playlist/route.ts
// Create a new YouTube playlist via API
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { google } from 'googleapis';

export async function POST() {
  const cookieStore = await cookies();
  const tokenStr = cookieStore.get('google_tokens')?.value;
  if (!tokenStr) return NextResponse.json({ error: 'Not logged in' }, { status: 401 });

  const tokens = JSON.parse(tokenStr);

  const oauth2Client = new google.auth.OAuth2();
  oauth2Client.setCredentials(tokens);

  const youtube = google.youtube({ version: 'v3', auth: oauth2Client });

  try {
    const response = await youtube.playlists.insert({
      part: ['snippet,status'],
      requestBody: {
        snippet: {
          title: 'Created by My Next.js App - ' + new Date().toLocaleString(),
          description: 'This playlist was created via Google OAuth + Next.js App Router!',
          defaultLanguage: 'en',
        },
        status: {
          privacyStatus: 'private', // or 'public' / 'unlisted'
        },
      },
    });
    // Successfully created playlist
    const playlistId = response.data.id;
    const url = `https://www.youtube.com/playlist?list=${playlistId}`;

    return NextResponse.json({ success: true, url, playlistId });
  } catch (error: any) {
    console.error('Failed to create playlist:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}