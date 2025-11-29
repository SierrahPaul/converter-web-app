// app/page.tsx  
import { Button } from '@/components/ui/button';
import oauth2Client from '@/app/utils/google-auth';
import LogoBar from '../components/LogoBar'
import '@/styles/spotify.css'


const scopes = ['https://www.googleapis.com/auth/youtube',
  'https://www.googleapis.com/auth/youtube.readonly'] // optional but harmless

export default function HomePage() {
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent',        // forces refresh token every time
    scope: scopes,
  });

  return (
    <html lang="en">
      <body className="grid min-h-screen place-items-center">


        <header>
          <LogoBar />
        </header>
        <main>
          <div id="main-content">
            <h1>Welcome to the Spotify to YouTube Converter!</h1>
            <h4>Sign in with your Google account to get started.</h4>
            <Button className="login-button" asChild>
              <a href={authUrl}>Sign in with Google → YouTube</a>
            </Button>
          </div>
        </main>

      </body>
    </html>
  );
}

