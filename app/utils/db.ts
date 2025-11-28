// app/utils/db.ts
import Database from "better-sqlite3";
import path from "path";

// Ensure proper typing for cache rows
export type CacheRow = {
  videoId: string;
};

// Create or open sqlite file in project root
const db = new Database(path.join(process.cwd(), "youtube-cache.db"));

// Create the cache table if not exists
db.prepare(
  `CREATE TABLE IF NOT EXISTS video_cache (
    key TEXT PRIMARY KEY,
    videoId TEXT NOT NULL
  )`
).run();

// Get a cached YouTube video ID
export function getVideoId(key: string): string | null {
  const row = db
    .prepare("SELECT videoId FROM video_cache WHERE key = ?")
    .get(key) as CacheRow | undefined;

  return row?.videoId ?? null;
}

// Save a YouTube video ID into the cache
export function setVideoId(key: string, videoId: string): void {
  db.prepare(
    "INSERT OR REPLACE INTO video_cache (key, videoId) VALUES (?, ?)"
  ).run(key, videoId);
}

export default db;
