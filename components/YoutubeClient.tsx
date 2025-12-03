// app/youtube/page.tsx
"use client";
//success/failure page for youtube import
import { useSearchParams } from 'next/navigation';
import LogoBar from '@/components/LogoBar';

export default function YouTubePage() {
  const params = useSearchParams();
  const status = params.get("status");
  const imported = params.get("imported");
  const url = params.get("url");
  const reason = params.get("reason");

  return (
    <>
      <header><LogoBar /></header>

      <main className="min-h-screen flex items-center justify-center px-6 bg-[#CD201F] text-white">
        <div className="text-center space-y-12 max-w-4xl">
          <h1 className="text-5xl md:text-6xl font-black leading-tight">
            {status === "success" ? "Playlist Converted!" : "Conversion Failed"}
          </h1>

          {status === "success" && imported && url ? (
            <div className="space-y-8">
              <p className="text-2xl md:text-3xl">
                Successfully imported <span className="text-white font-black">{imported}</span> tracks!
              </p>
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 text-lg break-all font-mono">
                {url}
              </div>
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-white text-black hover:bg-gray-200 font-bold text-xl px-20 py-9 rounded-2xl shadow-2xl transition"
              >
                Open in YouTube Music
              </a>
            </div>
          ) : (
            <div className="bg-black/30 border-2 border-white rounded-2xl p-10">
              <h2 className="text-4xl font-black mb-4">Error</h2>
              <p className="text-xl">{reason ? decodeURIComponent(reason) : "Something went wrong"}</p>
            </div>
          )}

          <a
            href="/dashboard"
            className="inline-block bg-white text-black hover:bg-gray-200 font-bold text-xl px-20 py-9 rounded-2xl shadow-2xl transition"
          >
            Convert Another Playlist
          </a>
        </div>
      </main>
    </>
  );
}