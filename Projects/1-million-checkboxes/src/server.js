const http = require("http");
const express = require("express");
const path = require("path");
const config = require("./config");
const { parseCookies } = require("./utils/cookies");
const { connectRedis, redis, publisher, subscriber } = require("./redis/client");
const { CheckboxStore } = require("./redis/checkboxStore");
const { createRedisRateLimiter } = require("./middleware/rateLimit");
const { createAuthRouter, attachUser } = require("./auth/routes");
const { createApiRouter } = require("./routes/api");
const { createCheckboxSocketServer } = require("./sockets/checkboxSocket");

async function main() {
  await connectRedis();

  const app = express();
  const server = http.createServer(app);
  const checkboxStore = new CheckboxStore(redis);

  app.set("trust proxy", true);
  app.use((req, res, next) => {
    req.cookies = parseCookies(req.headers.cookie);
    next();
  });
  app.use(attachUser);
  app.use(createRedisRateLimiter({
    redis,
    prefix: "http",
    max: config.httpRateLimitMax,
    windowSeconds: config.httpRateLimitWindowSeconds,
    keyGenerator: (req) => req.user?.sub || req.ip
  }));

  app.use(createAuthRouter());
  app.use(createApiRouter({ checkboxStore }));
  app.use(express.static(path.join(__dirname, "..", "public")));

  app.use((req, res) => {
    res.status(404).json({ error: "Not found" });
  });

  app.use((error, req, res, next) => {
    console.error(error);
    res.status(error.statusCode || 500).json({ error: error.message || "Internal server error" });
  });

  createCheckboxSocketServer({ server, checkboxStore, redis, publisher, subscriber });

  server.listen(config.port, () => {
    console.log(`1 Million Checkboxes running at ${config.publicBaseUrl}`);
  });
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
