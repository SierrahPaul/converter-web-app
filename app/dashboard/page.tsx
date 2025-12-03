// app/dashboard/page.tsx
"use client";
//dashboard page with spotify url input form
import { useState } from "react";
import LogoBar from "@/components/LogoBar";

export default function Dashboard() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const spotifyUrl = (e.currentTarget.elements.namedItem("spotifyUrl") as HTMLInputElement).value.trim();

    try {
      const res = await fetch("/api/spotify-to-youtube", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ spotifyUrl }),
      });
      const data = await res.json();
      setLoading(false);

      if (!res.ok) {
        console.error("API error response:", data);  // Log to Vercel console
        window.location.href = `/youtube?status=error&reason=${encodeURIComponent(data.error || "Failed")}`;
        return;
      }
      window.location.href = `/youtube?status=success&imported=${data.imported}&url=${encodeURIComponent(data.url)}`;
    } catch {
      setLoading(false);
      window.location.href = "/youtube?status=error&reason=Network+error";
    }
  };

  return (
    <>
      <header><LogoBar /></header>

      <main className="min-h-screen flex items-center justify-center px-6 bg-[#1DB954] text-black">
        <div className="text-center space-y-12 max-w-2xl w-full">
          <h1 className="text-5xl md:text-6xl font-black leading-tight">
            Spotify to YouTube Music Converter
          </h1>
          <p className="text-xl md:text-2xl text-black/90">
            Paste your Spotify playlist URL below
          </p>

          <form onSubmit={handleSubmit} className="space-y-10">
            <input
              name="spotifyUrl"
              type="url"
              placeholder="https://open.spotify.com/playlist/..."
              required
              disabled={loading}
              className="w-full px-8 py-6 text-xl bg-transparent border-4 border-black rounded-2xl text-white placeholder-black/70 focus:outline-none focus:border-gray-300 transition"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white hover:bg-gray-900 disabled:opacity-60 font-bold text-2xl py-7 rounded-2xl shadow-2xl transition"
            >
              {loading ? "Converting…" : "Convert Playlist"}
            </button>
          </form>
        </div>
      </main>
    </>
  );
}