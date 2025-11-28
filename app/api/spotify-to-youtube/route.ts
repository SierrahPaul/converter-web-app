// app/api/spotify-to-youtube/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { google } from "googleapis";
import { getVideoId, setVideoId } from "@/app/utils/db";

type Track = { artist: string; title: string };

export const POST = async (req: Request) => {
  try {
    const formData = await req.formData();
    const spotifyUrl = formData.get("spotifyUrl") as string;

    if (!spotifyUrl?.includes("open.spotify.com/playlist/")) {
      return NextResponse.json(
        { error: "Invalid Spotify playlist URL." },
        { status: 400 }
      );
    }

    // Extract playlist ID
    const match = spotifyUrl.match(/playlist\/([a-zA-Z0-9]+)/);
    if (!match) {
      return NextResponse.json(
        { error: "Unable to parse playlist ID." },
        { status: 400 }
      );
    }
    const playlistId = match[1];

    // 1. GET SPOTIFY TOKEN
    let spotifyToken: string;
    try {
      const tokenRes = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization:
            "Basic " +
            Buffer.from(
              `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
            ).toString("base64"),
        },
        body: "grant_type=client_credentials",
      });

      if (!tokenRes.ok) throw new Error("Spotify auth failed");
      const json = await tokenRes.json();
      spotifyToken = json.access_token;
    } catch {
      return NextResponse.json(
        { error: "Spotify authentication failed." },
        { status: 500 }
      );
    }

    // 2. GET YOUTUBE USER TOKENS
    const cookieStore = await cookies();
    const tokenStr = cookieStore.get("google_tokens")?.value;

    if (!tokenStr) {
      return NextResponse.json(
        { error: "Not logged into YouTube." },
        { status: 401 }
      );
    }

    let ytTokens;
    try {
      ytTokens = JSON.parse(tokenStr);
    } catch {
      return NextResponse.json(
        { error: "Invalid YouTube token." },
        { status: 401 }
      );
    }

    const oauth2 = new google.auth.OAuth2();
    oauth2.setCredentials(ytTokens);

    const youtube = google.youtube({
      version: "v3",
      auth: oauth2,
    });

    // 3. CREATE YOUTUBE PLAYLIST
    let ytPlaylistId: string;

    try {
      const res = await youtube.playlists.insert({
        part: ["snippet", "status"],
        requestBody: {
          snippet: {
            title: `Spotify → YouTube • ${new Date().toLocaleDateString()}`,
            description: "Imported automatically from Spotify",
          },
          status: { privacyStatus: "public" },
        },
      });

      ytPlaylistId = res.data.id!;
    } catch {
      return NextResponse.json(
        { error: "Failed to create YouTube playlist." },
        { status: 500 }
      );
    }

    // 4. FETCH TRACKS FROM SPOTIFY (up to ~100)
    let tracks: Track[] = [];
    let offset = 0;

    while (tracks.length < 100) {
      const res = await fetch(
        `https://api.spotify.com/v1/playlists/${playlistId}/tracks?limit=50&offset=${offset}`,
        { headers: { Authorization: `Bearer ${spotifyToken}` } }
      );

      if (!res.ok) break;

      const data = await res.json();

      const chunk: Track[] = (data.items || [])
        .map((item: any): Track => ({
          artist: item?.track?.artists?.[0]?.name,
          title: item?.track?.name,
        }))
        .filter((t: Track) => Boolean(t.artist && t.title));

      if (chunk.length === 0) break;

      tracks.push(...chunk);

      if (!data.next) break;

      offset += 50;
    }

    if (tracks.length === 0) {
      return NextResponse.json(
        { error: "No tracks found in playlist." },
        { status: 400 }
      );
    }


    // 5. SEARCH + ADD (WITH CACHE)
    const addedSet = new Set<string>();
    let addedCount = 0;

    for (const t of tracks) {
      if (addedCount >= 25) break;

      const key = `${t.artist.toLowerCase()}|${t.title.toLowerCase()}`;
      if (addedSet.has(key)) continue;


      // A. Check cache BEFORE search

      let videoId = getVideoId(key);

      // If not cached → perform a YouTube search (costs units)
      if (!videoId) {
        try {
          const search = await youtube.search.list({
            part: ["id"],
            q: `${t.artist} ${t.title}`,
            type: ["video"],
            maxResults: 1,
          });

          videoId = search.data.items?.[0]?.id?.videoId || null;

          // If found → save into cache to prevent future quota usage
          if (videoId) {
            setVideoId(key, videoId);
          }
        } catch {
          continue;
        }
      }

      if (!videoId) continue;


      // B. Add to playlist

      try {
        await youtube.playlistItems.insert({
          part: ["snippet"],
          requestBody: {
            snippet: {
              playlistId: ytPlaylistId,
              resourceId: {
                kind: "youtube#video",
                videoId,
              },
            },
          },
        });

        addedSet.add(key);
        addedCount++;
      } catch {
        continue;
      }
    }

    const playlistUrl = `https://www.youtube.com/playlist?list=${ytPlaylistId}`;

    return NextResponse.json({
      success: true,
      imported: addedCount,
      url: playlistUrl,
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        error: "Server error",
        details: err?.message || String(err),
      },
      { status: 500 }
    );
  }
};
