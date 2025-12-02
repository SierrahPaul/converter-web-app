// app/api/spotify-to-youtube/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { google } from "googleapis";
import { getVideoId, setVideoId } from "@/app/utils/db";

type Track = { artist: string; title: string };

type SpotifyPlaylistItem = {
  track: {
    artists: { name: string }[];
    name: string;
  } | null;
};

export const POST = async (req: Request) => {
  try {
    const { spotifyUrl } = await req.json();

    if (!spotifyUrl || typeof spotifyUrl !== "string") {
      return NextResponse.json({ error: "Missing Spotify URL" }, { status: 400 });
    }

    if (!spotifyUrl.includes("open.spotify.com/playlist/")) {
      return NextResponse.json({ error: "Invalid Spotify playlist URL." }, { status: 400 });
    }

    const match = spotifyUrl.match(/playlist\/([a-zA-Z0-9]+)/);
    if (!match) {
      return NextResponse.json({ error: "Unable to parse playlist ID" }, { status: 400 });
    }
    const playlistId = match[1];

    // Spotify Token
    let spotifyToken: string;
    try {
      const tokenRes = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: "Basic " + Buffer.from(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`).toString("base64"),
        },
        body: "grant_type=client_credentials",
      });
      if (!tokenRes.ok) throw new Error();
      spotifyToken = (await tokenRes.json()).access_token;
    } catch {
      return NextResponse.json({ error: "Spotify auth failed" }, { status: 500 });
    }

    // YouTube Auth
    const tokenStr = (await cookies()).get("google_tokens")?.value;
    if (!tokenStr) return NextResponse.json({ error: "Not logged into YouTube" }, { status: 401 });

    let ytTokens;
    try {
      ytTokens = JSON.parse(tokenStr);
    } catch {
      return NextResponse.json({ error: "Invalid YouTube token" }, { status: 401 });
    }

    const oauth2 = new google.auth.OAuth2();
    oauth2.setCredentials(ytTokens);
    const youtube = google.youtube({ version: "v3", auth: oauth2 });

    // Create Playlist
    let ytPlaylistId: string;
    try {
      const res = await youtube.playlists.insert({
        part: ["snippet", "status"],
        requestBody: {
          snippet: { title: `Spotify to YouTube • ${new Date().toLocaleDateString()}`, description: "Imported from Spotify" },
          status: { privacyStatus: "public" },
        },
      });
      ytPlaylistId = res.data.id!;
    } catch {
      return NextResponse.json({ error: "Failed to create playlist" }, { status: 500 });
    }

    // Fetch Tracks — FULLY TYPED
    const tracks: Track[] = [];
    let offset = 0;

    while (tracks.length < 100) {
      const res = await fetch(
        `https://api.spotify.com/v1/playlists/${playlistId}/tracks?limit=50&offset=${offset}`,
        { headers: { Authorization: `Bearer ${spotifyToken}` } }
      );

      if (!res.ok) break;
      const data: { items: SpotifyPlaylistItem[]; next: string | null } = await res.json();

      const chunk: Track[] = data.items
        .map((item) => {
          const artist = item.track?.artists?.[0]?.name?.trim();
          const title = item.track?.name?.trim();
          return artist && title ? { artist, title } : null;
        })
        .filter((t): t is Track => t !== null);

      tracks.push(...chunk);
      if (!data.next || chunk.length === 0) break;
      offset += 50;
    }

    if (tracks.length === 0) {
      return NextResponse.json({ error: "No tracks found" }, { status: 400 });
    }

    // Add to YouTube
    const addedSet = new Set<string>();
    let addedCount = 0;

    for (const track of tracks) {
      if (addedCount >= 25) break;
      const key = `${track.artist}|${track.title}`.toLowerCase();
      if (addedSet.has(key)) continue;

      let videoId = getVideoId(key);

      if (!videoId) {
        try {
          const search = await youtube.search.list({
            part: ["id"],
            q: `${track.artist} ${track.title}`,
            type: ["video"],
            maxResults: 1,
          });
          videoId = search.data.items?.[0]?.id?.videoId || null;
          if (videoId) setVideoId(key, videoId);
        } catch {
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
        addedSet.add(key);
        addedCount++;
      } catch {
        continue;
      }
    }

    return NextResponse.json({
      success: true,
      imported: addedCount,
      url: `https://www.youtube.com/playlist?list=${ytPlaylistId}`,
    });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
};