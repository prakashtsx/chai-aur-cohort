const { createClient } = require("redis");
const config = require("../config");

const redis = createClient({ url: config.redisUrl });
const publisher = redis.duplicate();
const subscriber = redis.duplicate();

async function connectRedis() {
  for (const client of [redis, publisher, subscriber]) {
    client.on("error", (error) => {
      console.error("[redis]", error.message);
    });
    if (!client.isOpen) {
      await client.connect();
    }
  }
}

module.exports = { redis, publisher, subscriber, connectRedis };
