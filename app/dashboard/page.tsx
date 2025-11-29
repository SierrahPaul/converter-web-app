// app/dashboard/page.tsx
/*/* //old code (working!!!)
"use client";

import { useState } from "react";

export default function Dashboard() {
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setAlert(null);

    const form = new FormData(e.currentTarget);

    const res = await fetch("/api/spotify-to-youtube", {
      method: "POST",
      body: form,
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setAlert({ type: "error", msg: data.error || "Conversion failed." });
      return;
    }

    setAlert({
      type: "success",
      msg: `Imported ${data.imported} tracks! Click here to view playlist.`,
    });

    // Reload dashboard after 2 seconds
    setTimeout(() => {
      window.location.reload();
    }, 2000);
  }

  return (
    <div className="min-h-screen p-10 bg-gray-100">
      <h1 className="text-3xl font-bold mb-4">Spotify → YouTube Playlist Importer</h1>
*/
      //{/* ALERTS */}
      /*
      {alert && (
        <div
          className={`p-4 mb-4 rounded-xl text-white ${
            alert.type === "success" ? "bg-green-600" : "bg-red-600"
          }`}
        >
          {alert.msg}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow-lg space-y-4 max-w-xl"
      >
        <input
          name="spotifyUrl"
          type="url"
          placeholder="Paste a Spotify playlist URL"
          required
          className="w-full border p-3 rounded-xl"
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-green-600 text-white px-6 py-3 rounded-xl font-bold w-full"
        >
          {loading ? "Converting…" : "Convert Playlist"}
        </button>
      </form>
    </div>
  );
}
*/

// New code in testing phase!!
"use client";

import { useState, useEffect } from "react";
import '@/styles/dashboard.css'
import LogoBar from '../../components/LogoBar'

export default function Dashboard() {
  const [loading, setLoading] = useState(false);
/*   const [alert, setAlert] = useState<{ type: "success" | "error"; msg: string } | null>(null);
 */
  // On page load, check URL params for alerts
 /*  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const status = params.get("status");
    const imported = params.get("imported");
    const url = params.get("url");
    const reason = params.get("reason");

    if (status === "success" && imported && url) {
      setAlert({
        type: "success",
        msg: `Imported ${imported} tracks! Click here to view playlist: ${url}`,
      });
    } else if (status === "error" && reason) {
      setAlert({ type: "error", msg: reason });
    }
  }, []); */

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
/*     setAlert(null);
 */

    const form = new FormData(e.currentTarget);

    const res = await fetch("/api/spotify-to-youtube", {
      method: "POST",
      body: form,
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      // setAlert({ type: "error", msg: data.error || "Conversion failed." });
      window.location.href = '/youtube?status=error&reason=${data.error}';
      return;
    }

    /* setAlert({
      type: "success",
      msg: `Imported ${data.imported} tracks! Click here to view playlist: ${data.url}`,
    }); */

    window.location.href = '/youtube?status=success&imported=${data.imported}&url=${data.url}'


    // Reload the page with alert preserved in query params
    /* const url = new URL(window.location.href);
    url.searchParams.set("status", "success");
    url.searchParams.set("imported", data.imported.toString());
    url.searchParams.set("url", data.url);
    window.location.href = url.toString(); */
  }

  return (
    <html lang="en">
      <body>
        <header>
          <LogoBar />
        </header>

        <main>
            <div className="main-content">
              {/* ALERTS */}
              {/* {alert && (
                <div
                  className={`p-4 rounded-xl text-white ${
                    alert.type === "success" ? "bg-green-600" : "bg-red-600"
                  }`}
                >
                  {alert.msg.includes("http") ? (
                    <a
                      href={alert.msg.split(" ").pop()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline"
                    >
                      {alert.msg}
                    </a>
                  ) : (
                    alert.msg
                  )}
                </div>
              )} */}

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

