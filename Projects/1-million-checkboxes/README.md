# 1 Million Checkboxes

Full-stack real-time checkbox grid built for the Web Dev Cohort 2026 assignment. The app uses Express, WebSockets, Redis bitmap storage, Redis Pub/Sub, a custom Redis-backed rate limiter, and a local OAuth 2.0 / OIDC-style authentication flow.

## Tech Stack

- Frontend: HTML, CSS, vanilla JavaScript
- Backend: Node.js, Express
- Real time: `ws` WebSocket server
- State and coordination: Redis bitmap plus Redis Pub/Sub
- Auth: local OAuth 2.0 Authorization Code / OIDC-style provider
- Rate limiting: custom Redis counters with expiry

## Features

- Large checkbox system with `TOTAL_CHECKBOXES=1000000`
- Efficient Redis bitmap storage using one bit per checkbox
- Frontend renders a movable window of checkboxes instead of 1 million DOM nodes
- Authenticated users can toggle checkboxes
- Anonymous users can view state in read-only mode
- WebSocket updates are broadcast to every connected browser in real time
- Redis Pub/Sub allows multiple Node server instances to share updates
- HTTP and WebSocket rate limiting implemented manually without `express-rate-limit`
- Clean route, auth, Redis, socket, and middleware separation

## Run Locally

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start Redis:

   ```bash
   docker run --name checkbox-redis -p 6379:6379 redis:7
   ```

   If you already have Redis running locally, keep `REDIS_URL=redis://localhost:6379`.

3. Create an environment file:

   ```bash
   cp .env.example .env
   ```

4. Start the app:

   ```bash
   npm run dev
   ```

5. Open:

   ```text
   http://localhost:3000
   ```

## Environment Variables

| Variable | Purpose |
| --- | --- |
| `PORT` | HTTP server port |
| `PUBLIC_BASE_URL` | Public app URL used as the OIDC issuer |
| `REDIS_URL` | Redis connection URL |
| `SESSION_SECRET` | Placeholder for session hardening in production |
| `JWT_SECRET` | HMAC secret for local access and ID tokens |
| `TOTAL_CHECKBOXES` | Total logical checkbox count |
| `VISIBLE_WINDOW_SIZE` | Number of checkboxes loaded per frontend window |
| `HTTP_RATE_LIMIT_MAX` | Max HTTP requests per window |
| `HTTP_RATE_LIMIT_WINDOW_SECONDS` | HTTP limiter window |
| `SOCKET_TOGGLE_LIMIT_MAX` | Max checkbox toggles per socket/user window |
| `SOCKET_TOGGLE_LIMIT_WINDOW_SECONDS` | WebSocket toggle limiter window |

## Redis Design

Checkbox state is stored in a Redis bitmap at:

```text
checkboxes:bitmap:v1
```

Each checkbox index maps to one bit. For 1,000,000 checkboxes this is compact, roughly 125 KB of raw bit state. The server reads visible ranges with pipelined `GETBIT` calls and writes updates with `SETBIT`.

Real-time fanout uses Redis Pub/Sub on:

```text
checkboxes:updates:v1
```

When one server instance receives a toggle, it writes the bit to Redis and publishes the update. Every instance subscribed to the channel forwards the update to its own connected sockets, so the design works with multiple Node processes.

## Auth Flow

The project includes a small local OAuth 2.0 / OIDC-style authentication server for demo purposes.

- `GET /auth/login` shows a login form
- `POST /auth/login` creates a local session cookie
- `GET /auth/authorize` supports Authorization Code redirects
- `POST /auth/token` exchanges an auth code for HMAC-signed JWT access and ID tokens
- `GET /.well-known/openid-configuration` exposes provider metadata
- `GET /auth/userinfo` returns the current user

The WebSocket connection reads the authenticated session cookie during the upgrade request. Toggle events are accepted only when a user session is present.

## WebSocket Flow

1. Browser connects to `/ws`.
2. Server assigns a socket ID and checks the session cookie.
3. Client sends:

   ```json
   {
     "event": "checkbox:toggle",
     "payload": {
       "index": 42,
       "checked": true
     }
   }
   ```

4. Server validates auth, range, and rate limits.
5. Server writes the new state to Redis with `SETBIT`.
6. Server publishes the update to Redis Pub/Sub.
7. All connected clients receive `checkbox:update`.

Last write wins if multiple users toggle the same checkbox near the same time. Redis stores the final bit value.

## Rate Limiting Logic

Rate limiting is custom code in `src/middleware/rateLimit.js`.

- HTTP requests use `INCR` on `rate:http:<ip-or-user-id>`
- WebSocket toggles use `INCR` on `rate:socket-toggle:<user-id>`
- New counters receive an `EXPIRE`
- Requests beyond the configured max return `429` or a socket `rate:limited` event

No external rate-limit package is used.

## Demo Video Checklist

The required YouTube unlisted demo should show:

- Login flow from `/auth/login`
- Checkbox grid loading
- Toggle action after login
- Two browser windows open at the same range
- Real-time update appearing in the second window
- Optional: rapid clicks triggering the WebSocket rate limit

## Deployment Notes

For deployment, use a Node host plus a managed Redis service. Set `PUBLIC_BASE_URL` to the deployed app URL and `REDIS_URL` to the managed Redis connection string. WebSockets must be enabled on the host.

## Screenshots / Links

- Live deployed link: add after deployment
- YouTube unlisted demo link: add after recording
- Public GitHub repository: add after pushing
