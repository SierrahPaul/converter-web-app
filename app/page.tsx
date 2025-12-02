// app/page.tsx
import { Button } from "@/components/ui/button";
import oauth2Client from "@/app/utils/google-auth";
import LogoBar from "../components/LogoBar";
import "@/styles/spotify.css";

const scopes = [
  "https://www.googleapis.com/auth/youtube",
  "https://www.googleapis.com/auth/youtube.readonly",
];

export default function HomePage() {
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: scopes,
  });

  return (
    <>
      <header>
        <LogoBar />
      </header>

      {/*full-screen centering */}
      <main className="grid min-h-screen place-items-center px-6">
        <div className="text-center space-y-10 max-w-4xl">
          {/* Big bold hero title */}
          <h1 className="text-5xl md:text-7xl font-black leading-tight">
            Welcome to the Spotify<br className="md:hidden" /> to YouTube Converter!
          </h1>

          {/* Clear subheading */}
          <p className="text-xl md:text-2xl font-bold text-gray-300">
            Sign in with your Google account to get started.
          </p>

          
          <Button
            className="login-button bg-black hover:bg-gray-900 text-white font-bold text-xl md:text-2xl px-12 py-7 rounded-xl shadow-2xl transition-all"
            asChild
          >
            <a href={authUrl}>
              Sign in with Google to YouTube
            </a>
          </Button>
        </div>
      </main>
    </>
  );
}