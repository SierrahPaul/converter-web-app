// New code in testing phase!!
"use client";

import { useState, useEffect } from "react";
import '@/styles/dashboard.css'
import LogoBar from '../../components/LogoBar'

export default function Dashboard() {
  const [loading, setLoading] = useState(false);


  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);


    const form = new FormData(e.currentTarget);

    const res = await fetch("/api/spotify-to-youtube", {
      method: "POST",
      body: form,
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      window.location.href = `/youtube?status=error&reason=${data.error}`;
      return;
    }

    window.location.href = `/youtube?status=success&imported=${data.imported}&url=${data.url}`;
  }

  return (
    <html lang="en">
      <body>
        <header>
          <LogoBar />
        </header>

        <main>
            <div className="main-content">
              <h1>Welcome to the Spotify to YouTube Music Converter</h1>
              <h4>Please enter the playlist URL and click ‘Generate’</h4>

              <form className="input-form"
                onSubmit={handleSubmit}
              >
                <input 
                  name="spotifyUrl"
                  type="url"
                  placeholder="Paste a Spotify playlist URL"
                  required
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

