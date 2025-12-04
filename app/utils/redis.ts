import { redis } from "googleapis/build/src/apis/redis";
import { createClient } from "redis";

let redisClient: ReturnType<typeof createClient> | null = null;

export function getRedisClient() {
    if (!redisClient) {
        redisClient = createClient({
            url: process.env.KV_REDIS_URL,
        });

        redisClient.on("error", (err) => console.error("Redis Client Error"))

        redisClient.connect();
    }

    return redisClient;
}