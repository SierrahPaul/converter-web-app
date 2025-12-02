// app/components/YoutubeClient.tsx
"use client";

import { useSearchParams } from 'next/navigation';
import '@/styles/youtube.css';
import LogoBar from '../components/LogoBar';
import { Inter } from 'next/font/google';

//  Inter Bold, safe here
const inter = Inter({
  subsets: ['latin'],
  weight: '700',
  display: 'swap',
});

export default function YouTubePage() {
  const params = useSearchParams();
  const status = params.get("status");
  const imported = params.get("imported");
  const url = params.get("url");
  const reason = params.get("reason");

  return (
    <html lang="en" className={inter.className}>
      {/* added inter font-bold */}
      <body className="font-bold">

        <header>
          <LogoBar />
        </header>

        <main>
          <div className="main-content">
            <h1>Converted Youtube Music Playlist</h1>

            {status === "success" && imported && url ? (
              <div className="alert success-alert">
                <h2>Success!</h2>
                <p>Imported {imported} tracks!</p>
                <p>All playlist are saved to our youtube account, here is your URL</p>
                <div className="playlist-url">
                  <h4>{url}</h4>
                </div>
                <a href={url} target="_blank" rel="noopener noreferrer" className="link">
                  View Playlist on YouTube
                </a>
              </div>
            ) : (
              <div className="alert error-alert">
                <h1>Error!</h1>
                <p>{reason}</p>
              </div>
            )}

            <a href="/dashboard" className="back-link">Add Another?</a>
          </div>
        </main>

      </body>
    </html>
  );
}