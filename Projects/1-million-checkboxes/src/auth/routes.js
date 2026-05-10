const express = require("express");
const crypto = require("crypto");
const config = require("../config");
const { serializeCookie } = require("../utils/cookies");
const { signJwt } = require("../utils/jwt");
const {
  createSession,
  getSession,
  deleteSession,
  createAuthCode,
  consumeAuthCode
} = require("./sessionStore");

function sha256Base64Url(value) {
  return crypto.createHash("sha256").update(value).digest("base64url");
}

function createAuthRouter() {
  const router = express.Router();

  router.get("/.well-known/openid-configuration", (req, res) => {
    res.json({
      issuer: config.publicBaseUrl,
      authorization_endpoint: `${config.publicBaseUrl}/auth/authorize`,
      token_endpoint: `${config.publicBaseUrl}/auth/token`,
      userinfo_endpoint: `${config.publicBaseUrl}/auth/userinfo`,
      response_types_supported: ["code"],
      subject_types_supported: ["public"],
      id_token_signing_alg_values_supported: ["HS256"],
      scopes_supported: ["openid", "profile"],
      token_endpoint_auth_methods_supported: ["none"]
    });
  });

  router.get("/auth/login", (req, res) => {
    const next = encodeURIComponent(req.query.next || "/");
    res.type("html").send(`<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Login - 1 Million Checkboxes</title>
  <link rel="stylesheet" href="/styles.css">
</head>
<body class="auth-page">
  <main class="auth-panel">
    <h1>Sign in</h1>
    <p>Use any display name for the local OAuth/OIDC demo provider.</p>
    <form method="post" action="/auth/login?next=${next}">
      <label>
        Display name
        <input name="name" minlength="2" maxlength="40" required autofocus placeholder="Ada Lovelace">
      </label>
      <button type="submit">Continue</button>
    </form>
  </main>
</body>
</html>`);
  });

  router.post("/auth/login", express.urlencoded({ extended: false }), (req, res) => {
    const displayName = String(req.body.name || "").trim().slice(0, 40);
    if (displayName.length < 2) return res.status(400).send("Display name is required.");

    const user = {
      sub: sha256Base64Url(displayName.toLowerCase()).slice(0, 24),
      name: displayName
    };
    const sessionId = createSession(user);
    res.setHeader("Set-Cookie", serializeCookie("sid", sessionId, {
      httpOnly: true,
      sameSite: "Lax",
      path: "/",
      maxAge: 60 * 60 * 8
    }));
    res.redirect(req.query.next || "/");
  });

  router.post("/auth/logout", (req, res) => {
    if (req.userSessionId) deleteSession(req.userSessionId);
    res.setHeader("Set-Cookie", serializeCookie("sid", "", {
      httpOnly: true,
      sameSite: "Lax",
      path: "/",
      maxAge: 0
    }));
    res.redirect("/");
  });

  router.get("/auth/authorize", (req, res) => {
    if (!req.user) {
      return res.redirect(`/auth/login?next=${encodeURIComponent(req.originalUrl)}`);
    }
    const { client_id: clientId, redirect_uri: redirectUri, state, code_challenge: codeChallenge } = req.query;
    if (!clientId || !redirectUri) return res.status(400).send("Missing client_id or redirect_uri.");

    const code = createAuthCode({
      user: req.user,
      clientId,
      redirectUri,
      codeChallenge
    });
    const redirect = new URL(redirectUri);
    redirect.searchParams.set("code", code);
    if (state) redirect.searchParams.set("state", state);
    res.redirect(redirect.toString());
  });

  router.post("/auth/token", express.urlencoded({ extended: false }), (req, res) => {
    const record = consumeAuthCode(req.body.code);
    if (!record) return res.status(400).json({ error: "invalid_grant" });
    if (record.clientId !== req.body.client_id || record.redirectUri !== req.body.redirect_uri) {
      return res.status(400).json({ error: "invalid_grant" });
    }
    if (record.codeChallenge) {
      const verifierHash = sha256Base64Url(req.body.code_verifier || "");
      if (verifierHash !== record.codeChallenge) return res.status(400).json({ error: "invalid_grant" });
    }

    const accessToken = signJwt({
      iss: config.publicBaseUrl,
      aud: "one-million-checkboxes",
      sub: record.user.sub,
      name: record.user.name,
      scope: "openid profile"
    }, config.jwtSecret, { expiresInSeconds: 3600 });

    res.json({
      token_type: "Bearer",
      access_token: accessToken,
      id_token: accessToken,
      expires_in: 3600
    });
  });

  router.get("/auth/userinfo", (req, res) => {
    if (!req.user) return res.status(401).json({ error: "login_required" });
    res.json(req.user);
  });

  router.get("/api/me", (req, res) => {
    res.json({ user: req.user || null });
  });

  return router;
}

function attachUser(req, res, next) {
  const sessionId = req.cookies.sid;
  const session = sessionId ? getSession(sessionId) : null;
  req.userSessionId = session ? sessionId : null;
  req.user = session ? session.user : null;
  next();
}

module.exports = { createAuthRouter, attachUser };
