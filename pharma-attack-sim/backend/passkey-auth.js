const {
  generateRegistrationOptions,
  verifyRegistrationResponse,
  generateAuthenticationOptions,
  verifyAuthenticationResponse,
} = require('@simplewebauthn/server');
const { randomUUID } = require('crypto');

function bufferToBase64url(buffer) {
  return Buffer.from(buffer).toString('base64url');
}

function base64urlToBuffer(value) {
  return Buffer.from(value, 'base64url');
}

function getUserByUsername(db, username) {
  const stmt = db.prepare('SELECT * FROM users WHERE username = ?');
  return stmt.get(username);
}

function createUser(db, { username, displayName, userHandle }) {
  const stmt = db.prepare(`
    INSERT INTO users (username, display_name, user_handle)
    VALUES (?, ?, ?)
    ON CONFLICT(username) DO UPDATE SET display_name = excluded.display_name
    RETURNING *
  `);
  return stmt.get(username, displayName, userHandle);
}

function updateUserChallenge(db, userId, challenge) {
  const stmt = db.prepare('UPDATE users SET current_challenge = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?');
  stmt.run(challenge, userId);
}

function updateUserCredential(db, userId, credential) {
  const stmt = db.prepare(`
    UPDATE users
    SET
      credential_id = ?,
      public_key = ?,
      counter = ?,
      backup_flags = ?,
      transports = ?,
      updated_at = CURRENT_TIMESTAMP,
      current_challenge = NULL
    WHERE id = ?
  `);

  stmt.run(
    credential.credentialID,
    credential.credentialPublicKey,
    credential.counter,
    credential.credentialBackedUp ? 'yes' : 'no',
    Array.isArray(credential.transports) ? credential.transports.join(',') : null,
    userId,
  );
}

function getCredentialForUser(user) {
  if (!user || !user.credential_id) {
    return null;
  }

  return {
    credentialID: base64urlToBuffer(user.credential_id),
    credentialPublicKey: base64urlToBuffer(user.public_key),
    counter: user.counter || 0,
    transports: user.transports ? user.transports.split(',').filter(Boolean) : [],
    credentialBackedUp: user.backup_flags === 'yes',
  };
}

async function startRegistration(db, config, { username, displayName }) {
  if (!username || !displayName) {
    throw new Error('username and displayName are required');
  }

  const normalizedUsername = username.toLowerCase();
  let user = getUserByUsername(db, normalizedUsername);
  const userHandle = user?.user_handle || randomUUID().replace(/-/g, '');

  user = createUser(db, {
    username: normalizedUsername,
    displayName,
    userHandle,
  });

  const existingCred = getCredentialForUser(user);

  const options = await generateRegistrationOptions({
    rpName: config.auth?.rpName || 'Pharma Attack Simulator',
    rpID: config.auth?.rpID || 'localhost',
    userID: user.user_handle,
    userName: normalizedUsername,
    userDisplayName: displayName,
    attestationType: 'none',
    authenticatorSelection: {
      residentKey: 'preferred',
      userVerification: 'required',
      authenticatorAttachment: 'platform',
    },
    excludeCredentials: existingCred
      ? [
          {
            id: existingCred.credentialID,
            type: 'public-key',
            transports: existingCred.transports,
          },
        ]
      : [],
  });

  updateUserChallenge(db, user.id, options.challenge);

  return options;
}

async function finishRegistration(db, config, { username, attestationResponse }) {
  const normalizedUsername = username.toLowerCase();
  const user = getUserByUsername(db, normalizedUsername);

  if (!user || !user.current_challenge) {
    throw new Error('Registration not initiated or challenge expired');
  }

  const verification = await verifyRegistrationResponse({
    response: attestationResponse,
    expectedChallenge: user.current_challenge,
    expectedOrigin: config.auth?.expectedOrigin || 'http://localhost:3000',
    expectedRPID: config.auth?.rpID || 'localhost',
    requireUserVerification: true,
  });

  if (!verification.verified || !verification.registrationInfo) {
    throw new Error('Passkey registration failed verification');
  }

  const { registrationInfo } = verification;

  updateUserCredential(db, user.id, {
    credentialID: bufferToBase64url(registrationInfo.credentialID),
    credentialPublicKey: bufferToBase64url(registrationInfo.credentialPublicKey),
    counter: registrationInfo.counter,
    credentialBackedUp: registrationInfo.credentialBackedUp,
    transports: registrationInfo.transports,
  });

  return {
    userId: user.id,
    username: user.username,
    displayName: user.display_name,
  };
}

async function startAuthentication(db, config, { username }) {
  const normalizedUsername = username.toLowerCase();
  const user = getUserByUsername(db, normalizedUsername);

  if (!user || !user.credential_id) {
    throw new Error('User not registered');
  }

  const existingCred = getCredentialForUser(user);

  const options = await generateAuthenticationOptions({
    rpID: config.auth?.rpID || 'localhost',
    userVerification: 'required',
    allowCredentials: [
      {
        id: existingCred.credentialID,
        type: 'public-key',
        transports: existingCred.transports,
      },
    ],
  });

  updateUserChallenge(db, user.id, options.challenge);

  return options;
}

async function finishAuthentication(db, config, { username, assertionResponse }) {
  const normalizedUsername = username.toLowerCase();
  const user = getUserByUsername(db, normalizedUsername);

  if (!user || !user.current_challenge || !user.credential_id) {
    throw new Error('Authentication not initiated or user not registered');
  }

  const credential = getCredentialForUser(user);

  const verification = await verifyAuthenticationResponse({
    response: assertionResponse,
    expectedChallenge: user.current_challenge,
    expectedOrigin: config.auth?.expectedOrigin || 'http://localhost:3000',
    expectedRPID: config.auth?.rpID || 'localhost',
    authenticator: credential,
    requireUserVerification: true,
  });

  if (!verification.verified || !verification.authenticationInfo) {
    throw new Error('Passkey authentication failed verification');
  }

  const { authenticationInfo } = verification;

  const stmt = db.prepare(`
    UPDATE users
    SET counter = ?, current_challenge = NULL, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `);
  stmt.run(authenticationInfo.newCounter, user.id);

  return {
    userId: user.id,
    username: user.username,
    displayName: user.display_name,
  };
}

module.exports = {
  startRegistration,
  finishRegistration,
  startAuthentication,
  finishAuthentication,
};


