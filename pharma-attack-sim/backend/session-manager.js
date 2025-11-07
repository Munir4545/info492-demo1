const { randomBytes } = require('crypto');

function generateToken() {
  return randomBytes(48).toString('base64url');
}

function createSession(db, userId, ttlHours = 24) {
  const token = generateToken();
  const expiresAt = ttlHours
    ? new Date(Date.now() + ttlHours * 60 * 60 * 1000).toISOString()
    : null;

  const stmt = db.prepare(`
    INSERT INTO sessions (token, user_id, expires_at)
    VALUES (?, ?, ?)
  `);
  stmt.run(token, userId, expiresAt);

  return { token, expiresAt };
}

function getSessionUser(db, token) {
  const stmt = db.prepare(`
    SELECT users.*
    FROM sessions
    INNER JOIN users ON users.id = sessions.user_id
    WHERE sessions.token = ?
      AND (sessions.expires_at IS NULL OR DATETIME(sessions.expires_at) > DATETIME('now'))
  `);

  return stmt.get(token);
}

function deleteSession(db, token) {
  const stmt = db.prepare('DELETE FROM sessions WHERE token = ?');
  stmt.run(token);
}

function purgeExpiredSessions(db) {
  const stmt = db.prepare("DELETE FROM sessions WHERE expires_at IS NOT NULL AND DATETIME(expires_at) <= DATETIME('now')");
  stmt.run();
}

module.exports = {
  createSession,
  getSessionUser,
  deleteSession,
  purgeExpiredSessions,
};


