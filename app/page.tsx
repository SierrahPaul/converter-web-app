// app/page.tsx
import { Button } from '@/components/ui/button';
import oauth2Client from '@/app/utils/google-auth';
import LogoBar from '../components/LogoBar';
import '@/styles/spotify.css';
import { Inter } from 'next/font/google';

//  Inter Bold (safe here, no conflict with server-only)
const inter = Inter({
  subsets: ['latin'],
  weight: '700',
  display: 'swap',
});

const scopes = [
  'https://www.googleapis.com/auth/youtube',
  'https://www.googleapis.com/auth/youtube.readonly'
];

export default function HomePage() {
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent',
    scope: scopes,
  });

  return (
    <html lang="en" className={inter.className}>
      <body className="grid min-h-screen place-items-center font-bold">
        {/*font-bold added */}

        <header>
          <LogoBar />
        </header>
        <main>
          <div id="main-content">
            <h1>Welcome to the Spotify to YouTube Converter!</h1>
            <h4>Sign in with your Google account to get started.</h4>
            <Button className="login-button" asChild>
              <a href={authUrl}>Sign in with Google to YouTube</a>
            </Button>
          </div>
        </main>

      </body>
    </html>
  );
}