const crypto = require("crypto");
const { WebSocketServer } = require("ws");
const config = require("../config");
const { parseCookies } = require("../utils/cookies");
const { getSession } = require("../auth/sessionStore");
const { consumeSocketLimit } = require("../middleware/rateLimit");

const CHANNEL = "checkboxes:updates:v1";

function send(socket, event, payload) {
  if (socket.readyState === socket.OPEN) {
    socket.send(JSON.stringify({ event, payload }));
  }
}

function createCheckboxSocketServer({ server, checkboxStore, redis, publisher, subscriber }) {
  const wss = new WebSocketServer({ server, path: "/ws" });
  const clients = new Map();
  const instanceId = crypto.randomUUID();

  subscriber.subscribe(CHANNEL, (message) => {
    const update = JSON.parse(message);
    for (const [socketId, client] of clients) {
      if (update.originSocketId && update.originSocketId === socketId) continue;
      send(client.socket, "checkbox:update", {
        index: update.index,
        checked: update.checked,
        user: update.user,
        sourceInstanceId: update.instanceId
      });
    }
  });

  wss.on("connection", (socket, req) => {
    const socketId = crypto.randomUUID();
    const cookies = parseCookies(req.headers.cookie);
    const session = cookies.sid ? getSession(cookies.sid) : null;
    const user = session ? session.user : null;

    clients.set(socketId, {
      socket,
      user,
      connectedAt: Date.now(),
      ip: req.socket.remoteAddress
    });

    send(socket, "socket:ready", {
      socketId,
      authenticated: Boolean(user),
      user,
      total: config.totalCheckboxes
    });

    socket.on("message", async (raw) => {
      try {
        const message = JSON.parse(raw.toString());
        if (message.event !== "checkbox:toggle") return;

        const client = clients.get(socketId);
        if (!client?.user) {
          return send(socket, "error", { message: "Login required before toggling checkboxes." });
        }

        const limit = await consumeSocketLimit(redis, client.user.sub || socketId, {
          max: config.socketToggleLimitMax,
          windowSeconds: config.socketToggleLimitWindowSeconds
        });
        if (!limit.allowed) {
          return send(socket, "rate:limited", {
            message: "Too many checkbox updates. Please slow down.",
            remaining: 0
          });
        }

        const index = Number(message.payload?.index);
        const checked = Boolean(message.payload?.checked);
        await checkboxStore.set(index, checked);

        const update = {
          index,
          checked,
          user: { sub: client.user.sub, name: client.user.name },
          socketId,
          originSocketId: socketId,
          instanceId,
          updatedAt: new Date().toISOString()
        };
        await publisher.publish(CHANNEL, JSON.stringify(update));
        send(socket, "checkbox:ack", { index, checked, remaining: limit.remaining });
      } catch (error) {
        send(socket, "error", { message: error.message || "Invalid socket message." });
      }
    });

    socket.on("close", () => {
      clients.delete(socketId);
    });
  });

  return wss;
}

module.exports = { createCheckboxSocketServer };
