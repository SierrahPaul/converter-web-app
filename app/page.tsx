// app/page.tsx  
import { Button } from '@/components/ui/button';
import oauth2Client from '@/app/utils/google-auth';

const scopes = ['https://www.googleapis.com/auth/youtube',
  'https://www.googleapis.com/auth/youtube.readonly'] // optional but harmless

export default function HomePage() {
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent',        // forces refresh token every time
    scope: scopes,
  });

  return (
    <main className="grid min-h-screen place-items-center">
      <Button asChild>
        <a href={authUrl}>Sign in with Google → YouTube</a>
      </Button>
    </main>
  );
}

