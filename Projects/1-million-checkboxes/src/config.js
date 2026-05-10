require("dotenv").config();

const config = {
  port: Number(process.env.PORT || 3000),
  publicBaseUrl: process.env.PUBLIC_BASE_URL || "http://localhost:3000",
  redisUrl: process.env.REDIS_URL || "redis://localhost:6379",
  sessionSecret: process.env.SESSION_SECRET || "dev-session-secret",
  jwtSecret: process.env.JWT_SECRET || "dev-jwt-secret",
  totalCheckboxes: Number(process.env.TOTAL_CHECKBOXES || 1_000_000),
  visibleWindowSize: Number(process.env.VISIBLE_WINDOW_SIZE || 1000),
  httpRateLimitMax: Number(process.env.HTTP_RATE_LIMIT_MAX || 120),
  httpRateLimitWindowSeconds: Number(process.env.HTTP_RATE_LIMIT_WINDOW_SECONDS || 60),
  socketToggleLimitMax: Number(process.env.SOCKET_TOGGLE_LIMIT_MAX || 60),
  socketToggleLimitWindowSeconds: Number(process.env.SOCKET_TOGGLE_LIMIT_WINDOW_SECONDS || 10)
};

module.exports = config;