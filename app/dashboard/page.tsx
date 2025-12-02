// app/dashboard/page.tsx
"use client";

import { useState } from "react";
import LogoBar from "@/components/LogoBar";
import "@/styles/dashboard.css";
import { Inter } from "next/font/google";

//  Inter Bold — safe to import here
const inter = Inter({
  subsets: ["latin"],
  weight: "700",
  display: "swap",
});

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
    <html lang="en" className={inter.className}>
      {/* added inter font-bold */}
      <body className="font-bold">

        <header>
          <LogoBar />
        </header>

        <main>
          <div className="main-content">
            <h1>Welcome to the Spotify to YouTube Music Converter</h1>
            <h4>Please enter the playlist URL and click ‘Generate’</h4>

            <form className="input-form" onSubmit={handleSubmit}>
              <input
                name="spotifyUrl"
                type="url"
                placeholder="Paste a Spotify playlist URL"
                required
                disabled={loading}
                className="link-input"
              />

              <button
                type="submit"
                disabled={loading}
                className="generate-button"
              >
                {loading ? "Converting…" : "Convert Playlist"}
              </button>
            </form>
          </div>
        </main>

      </body>
    </html>
  );
}