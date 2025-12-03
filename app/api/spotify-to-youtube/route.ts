// app/api/spotify-to-youtube/route.ts
export const dynamic = 'force-dynamic'; // vercel caching fix?

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { google } from "googleapis";
import { getVideoId, setVideoId } from "@/app/utils/db";

type Track = { artist: string; title: string };

export const POST = async (req: Request) => {
  try {
    // Used JSON instead of formData()
    const body = await req.json();
    const spotifyUrl: string = body.spotifyUrl;

    if (!spotifyUrl || !spotifyUrl.includes("open.spotify.com/playlist/")) {
      return NextResponse.json({ error: "Invalid Spotify playlist URL." }, { status: 400 });
    }

    const playlistId = spotifyUrl.match(/playlist\/([a-zA-Z0-9]+)/)?.[1];
    if (!playlistId) {
      return NextResponse.json({ error: "Unable to parse playlist ID." }, { status: 400 });
    }

    // === SPOTIFY TOKEN ===
    let spotifyToken: string;
    try {
      const res = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: "Basic " + Buffer.from(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`).toString("base64"),
        },
        body: "grant_type=client_credentials",
      });
      if (!res.ok) throw new Error();
      spotifyToken = (await res.json()).access_token;
    } catch {
      return NextResponse.json({ error: "Failed to connect to Spotify." }, { status: 500 });
    }

    // === YOUTUBE AUTH ===
    const cookieStore = await cookies();
    const tokenStr = cookieStore.get("google_tokens")?.value;
    if (!tokenStr) return NextResponse.json({ error: "Not signed in to YouTube." }, { status: 401 });

    let ytTokens;
    try {
      ytTokens = JSON.parse(tokenStr);
    } catch {
      return NextResponse.json({ error: "Invalid YouTube session." }, { status: 401 });
    }

    const oauth2 = new google.auth.OAuth2();
    oauth2.setCredentials(ytTokens);
    const youtube = google.youtube({ version: "v3", auth: oauth2 });

    // === CREATE PLAYLIST ===
    let ytPlaylistId: string;
    try {
      const res = await youtube.playlists.insert({
        part: ["snippet,status"],
        requestBody: {
          snippet: {
            title: `Spotify to YouTube • ${new Date().toLocaleDateString()}`,
            description: "Imported from Spotify",
          },
          status: { privacyStatus: "public" },
        },
      });
      ytPlaylistId = res.data.id!;
    } catch (e) {
      console.error("Playlist creation failed:", e);
      return NextResponse.json({ error: "Failed to create YouTube playlist." }, { status: 500 });
    }

    // === FETCH SPOTIFY TRACKS ===
    const tracks: Track[] = [];
    let offset = 0;

    while (tracks.length < 100) {
      try {
        const res = await fetch(
          `https://api.spotify.com/v1/playlists/${playlistId}/tracks?limit=50&offset=${offset}`,
          { headers: { Authorization: `Bearer ${spotifyToken}` } }
        );
        if (!res.ok) break;
        const data = await res.json();

        for (const item of data.items || []) {
          const t = item?.track;
          if (!t || t.is_local || !t.artists?.[0]?.name || !t.name) continue;
          tracks.push({
            artist: t.artists[0].name.trim(),
            title: t.name.trim(),
          });
        }

        if (!data.next) break;
        offset += 50;
      } catch (e) {
        console.error("Spotify fetch error:", e);
        break;
      }
    }

    if (tracks.length === 0) {
      return NextResponse.json({ error: "No valid tracks found." }, { status: 400 });
    }

    // === ADD UP TO 25 TRACKS (with caching) ===
    let addedCount = 0;
    const addedKeys = new Set<string>();

    for (const track of tracks) {
      if (addedCount >= 25) break;

      const key = `${track.artist}|${track.title}`.toLowerCase();
      if (addedKeys.has(key)) continue;

      let videoId = getVideoId(key);

      if (!videoId) {
        try {
          const search = await youtube.search.list({
            part: ["id"],
            q: `${track.artist} ${track.title}`,
            type: ["video"],
            maxResults: 1,
            videoCategoryId: "10",
          });
          videoId = search.data.items?.[0]?.id?.videoId || null;
          if (videoId) setVideoId(key, videoId);
        } catch (e) {
          console.warn(`Search failed: ${track.artist} - ${track.title}`, e);
          continue;
        }
      }

      if (!videoId) continue;

      try {
        await youtube.playlistItems.insert({
          part: ["snippet"],
          requestBody: {
            snippet: {
              playlistId: ytPlaylistId,
              resourceId: { kind: "youtube#video", videoId },
            },
          },
        });
        addedKeys.add(key);
        addedCount++;
      } catch (e) {
        console.warn(`Failed to add ${videoId}`, e);
      }
    }

    return NextResponse.json({
      success: true,
      imported: addedCount,
      url: `https://www.youtube.com/playlist?list=${ytPlaylistId}`,
    });
  } catch (err: any) {
    console.error("FATAL ERROR:", err);
    return NextResponse.json({ error: "Server error – please try again" }, { status: 500 });
  }
};