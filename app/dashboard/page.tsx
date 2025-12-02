// app/dashboard/page.tsx
"use client";

import { useState } from "react";
import LogoBar from "@/components/LogoBar";
import "@/styles/dashboard.css";

export default function Dashboard() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const spotifyUrl = (
      e.currentTarget.elements.namedItem("spotifyUrl") as HTMLInputElement
    ).value.trim();

    if (!spotifyUrl) {
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/spotify-to-youtube", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ spotifyUrl }),
      });

      const data = await res.json();
      setLoading(false);

      if (!res.ok) {
        window.location.href = `/youtube?status=error&reason=${encodeURIComponent(
          data.error || "Unknown error"
        )}`;
        return;
      }

      window.location.href = `/youtube?status=success&imported=${data.imported}&url=${encodeURIComponent(
        data.url
      )}`;
    } catch {
      setLoading(false);
      window.location.href = "/youtube?status=error&reason=Network+error";
    }
  };

  return (
    <>
      <header>
        <LogoBar />
      </header>

      <main className="min-h-screen flex items-center justify-center px-6">
        <div className="text-center space-y-10 max-w-4xl w-full">
          {/* Big bold headline */}
          <h1 className="text-5xl md:text-6xl font-black leading-tight">
            Welcome to the Spotify to YouTube Music Converter
          </h1>

          {/* Subheadline */}
          <p className="text-xl md:text-2xl text-gray-300 font-bold">
            Please enter the playlist URL and click ‘Convert’
          </p>

          {/* White form card */}
          <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 max-w-2xl mx-auto">
            <form className="space-y-8" onSubmit={handleSubmit}>
              <input
                name="spotifyUrl"
                type="url"
                placeholder="Paste a Spotify playlist URL"
                required
                disabled={loading}
                className="link-input w-full px-8 py-6 text-lg md:text-xl text-gray-800 placeholder:text-gray-500 focus:outline-none focus:ring-4 focus:ring-blue-300 rounded-xl border-2 border-gray-200 transition-all"
              />

              <button
                type="submit"
                disabled={loading}
                className="generate-button w-full bg-black hover:bg-gray-900 text-white font-bold text-xl md:text-2xl py-6 rounded-xl transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg"
              >
                {loading ? "Converting…" : "Convert Playlist"}
              </button>
            </form>
          </div>
        </div>
      </main>
    </>
  );
}