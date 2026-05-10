const crypto = require("crypto");

const sessions = new Map();
const authCodes = new Map();

function createSession(user) {
  const sessionId = crypto.randomBytes(32).toString("base64url");
  sessions.set(sessionId, { user, createdAt: Date.now() });
  return sessionId;
}

function getSession(sessionId) {
  return sessions.get(sessionId) || null;
}

function deleteSession(sessionId) {
  sessions.delete(sessionId);
}

function createAuthCode({ user, clientId, redirectUri, codeChallenge }) {
  const code = crypto.randomBytes(32).toString("base64url");
  authCodes.set(code, {
    user,
    clientId,
    redirectUri,
    codeChallenge,
    expiresAt: Date.now() + 5 * 60 * 1000
  });
  return code;
}

function consumeAuthCode(code) {
  const record = authCodes.get(code);
  authCodes.delete(code);
  if (!record || record.expiresAt < Date.now()) return null;
  return record;
}

module.exports = {
  createSession,
  getSession,
  deleteSession,
  createAuthCode,
  consumeAuthCode
};
