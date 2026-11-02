/**
 * Minimal in-memory sliding-window rate limiter.
 *
 * This protects a single server instance. Hosting platforms that run multiple
 * instances or serverless functions should add an edge/platform rate limit as
 * documented in the deployment runbook; this limiter remains a defence in
 * depth and keeps tests deterministic.
 */
export function createRateLimiter({
  limit = 5,
  windowMs = 60_000,
  now = () => Date.now(),
} = {}) {
  const buckets = new Map();

  function prune(timestamp) {
    for (const [key, bucket] of buckets) {
      if (bucket.resetAt <= timestamp) {
        buckets.delete(key);
      }
    }
  }

  return {
    check(key) {
      const timestamp = now();
      let bucket = buckets.get(key);

      if (!bucket || bucket.resetAt <= timestamp) {
        bucket = { count: 0, resetAt: timestamp + windowMs };
        buckets.set(key, bucket);
      }

      if (bucket.count >= limit) {
        return {
          allowed: false,
          remaining: 0,
          retryAfterSeconds: Math.max(
            1,
            Math.ceil((bucket.resetAt - timestamp) / 1000)
          ),
        };
      }

      bucket.count += 1;

      // Opportunistic cleanup keeps the map bounded without a background timer.
      if (buckets.size > 1000) {
        prune(timestamp);
      }

      return {
        allowed: true,
        remaining: Math.max(0, limit - bucket.count),
        retryAfterSeconds: 0,
      };
    },

    reset() {
      buckets.clear();
    },

    get size() {
      return buckets.size;
    },
  };
}

/** Returns the best-effort client IP for rate limiting and logging keys. */
export function getClientIp(request) {
  const forwardedFor = request.headers?.["x-forwarded-for"];
  if (typeof forwardedFor === "string" && forwardedFor.length > 0) {
    return forwardedFor.split(",")[0].trim();
  }

  const realIp = request.headers?.["x-real-ip"];
  if (typeof realIp === "string" && realIp.length > 0) {
    return realIp.trim();
  }

  return request.socket?.remoteAddress || "unknown";
}
