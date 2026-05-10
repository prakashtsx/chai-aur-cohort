function createRedisRateLimiter({ redis, prefix, max, windowSeconds, keyGenerator }) {
  return async function rateLimit(req, res, next) {
    try {
      const identity = keyGenerator(req);
      const key = `rate:${prefix}:${identity}`;
      const hits = await redis.incr(key);
      if (hits === 1) await redis.expire(key, windowSeconds);
      if (hits > max) {
        res.set("Retry-After", String(windowSeconds));
        return res.status(429).json({ error: "Too many requests. Please slow down." });
      }
      return next();
    } catch (error) {
      return next(error);
    }
  };
}

async function consumeSocketLimit(redis, identity, { max, windowSeconds }) {
  const key = `rate:socket-toggle:${identity}`;
  const hits = await redis.incr(key);
  if (hits === 1) await redis.expire(key, windowSeconds);
  return {
    allowed: hits <= max,
    remaining: Math.max(0, max - hits)
  };
}

module.exports = { createRedisRateLimiter, consumeSocketLimit };
