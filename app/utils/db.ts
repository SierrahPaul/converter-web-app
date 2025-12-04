import { getRedisClient } from "./redis";

export async function getVideoId(key: string) {
    const client = getRedisClient();
    return client.get(`video:${key}`);
}

export async function setVideoId(key: string, videoId: string) {
    const client = getRedisClient();
    await client.set(`video:${key}`, videoId);
}