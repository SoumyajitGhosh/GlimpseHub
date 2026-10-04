const { createClient } = require('redis');

// Redis is optional: without REDIS_URL the app runs as a single instance exactly as before.
// With it, Socket.IO events and rate-limit counters are shared across every backend instance.
const REDIS_URL = process.env.REDIS_URL;

let client = null;

/**
 * Returns the shared Redis client (connecting on first use), or null when REDIS_URL is unset.
 */
const getRedisClient = () => {
    if (!REDIS_URL) return null;
    if (!client) {
        client = createClient({ url: REDIS_URL });
        client.on('error', (err) => console.log('Redis error:', err.message));
        client.connect().catch((err) => console.log('Redis connect failed:', err.message));
    }
    return client;
};

module.exports = { getRedisClient };
