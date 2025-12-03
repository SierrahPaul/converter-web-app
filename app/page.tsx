// app/page.tsx
import { Button } from '@/components/ui/button';
import oauth2Client from '@/app/utils/google-auth';
import LogoBar from '../components/LogoBar';
import '@/styles/spotify.css';
// home page with google oauth2 sign-in button
const scopes = ['https://www.googleapis.com/auth/youtube', 'https://www.googleapis.com/auth/youtube.readonly'];
// scopes for YouTube playlist management
export default function HomePage() {
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent',
    scope: scopes,
  });

  return (
    <>
      <header><LogoBar /></header>

      <main className="grid min-h-screen place-items-center px-6">
        <div className="text-center space-y-12 max-w-4xl">
          <h1 className="text-5xl md:text-7xl font-black leading-tight text-black">
            Welcome to the Spotify to YouTube Converter!
          </h1>
          <p className="text-2xl md:text-3xl text-black">
            Sign in with your Google account to get started.
          </p>

          <Button asChild className="bg-black  hover:bg-gray-900 font-bold text-2xl px-16 py-10 rounded-2xl shadow-2xl transition">
            <a href={authUrl}>Sign in with Google to YouTube</a>
          </Button>
        </div>
      </main>
    </>
  );
}