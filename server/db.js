import { DatabaseSync } from "node:sqlite";
import { mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const dbPath = process.env.DB_PATH || resolve(here, "data", "app.db");

mkdirSync(dirname(dbPath), { recursive: true });

const db = new DatabaseSync(dbPath);

db.exec(`
  PRAGMA journal_mode = WAL;
  PRAGMA foreign_keys = ON;

  CREATE TABLE IF NOT EXISTS users (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    name       TEXT NOT NULL,
    username   TEXT NOT NULL UNIQUE COLLATE NOCASE,
    email      TEXT NOT NULL UNIQUE COLLATE NOCASE,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS sessions (
    token      TEXT PRIMARY KEY,
    user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    expires_at INTEGER NOT NULL
  );

  -- Only a SHA-256 of the emailed token is stored, so a leaked database can't
  -- be used to reset anyone's password.
  CREATE TABLE IF NOT EXISTS password_resets (
    token_hash TEXT PRIMARY KEY,
    user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    expires_at INTEGER NOT NULL
  );
`);

// Databases created before passwords / photos existed lack these columns.
// Accounts from that time have no password_hash and can't log in.
const userColumns = db
  .prepare("PRAGMA table_info(users)")
  .all()
  .map((column) => column.name);

if (!userColumns.includes("password_hash")) {
  db.exec("ALTER TABLE users ADD COLUMN password_hash TEXT");
}
if (!userColumns.includes("avatar")) {
  db.exec("ALTER TABLE users ADD COLUMN avatar TEXT");
}

export function findUserByIdentifier(identifier) {
  return db
    .prepare("SELECT * FROM users WHERE email = ? OR username = ?")
    .get(identifier, identifier);
}

export function findUserByEmail(email) {
  return db.prepare("SELECT * FROM users WHERE email = ?").get(email);
}

export function findUserById(id) {
  return db.prepare("SELECT * FROM users WHERE id = ?").get(id);
}

export function findConflicts({ username, email }) {
  return db
    .prepare("SELECT username, email FROM users WHERE username = ? OR email = ?")
    .all(username, email);
}

export function createUser({ name, username, email, passwordHash, avatar }) {
  const result = db
    .prepare(
      `INSERT INTO users (name, username, email, password_hash, avatar)
       VALUES (?, ?, ?, ?, ?)`,
    )
    .run(name, username, email, passwordHash, avatar);
  return findUserById(Number(result.lastInsertRowid));
}

export function updateAvatar(id, avatar) {
  db.prepare("UPDATE users SET avatar = ? WHERE id = ?").run(avatar, id);
  return findUserById(id);
}

// Sessions go with the user (ON DELETE CASCADE).
export function deleteUser(id) {
  db.prepare("DELETE FROM users WHERE id = ?").run(id);
}

export function createSession(token, userId, expiresAt) {
  db.prepare(
    "INSERT INTO sessions (token, user_id, expires_at) VALUES (?, ?, ?)",
  ).run(token, userId, expiresAt);
}

export function findUserBySession(token) {
  return db
    .prepare(
      `SELECT users.* FROM sessions
       JOIN users ON users.id = sessions.user_id
       WHERE sessions.token = ? AND sessions.expires_at > ?`,
    )
    .get(token, Date.now());
}

export function deleteSession(token) {
  db.prepare("DELETE FROM sessions WHERE token = ?").run(token);
}

export function deleteExpiredSessions() {
  db.prepare("DELETE FROM sessions WHERE expires_at <= ?").run(Date.now());
  db.prepare("DELETE FROM password_resets WHERE expires_at <= ?").run(Date.now());
}

// A user has at most one live reset link: asking again replaces the old one.
export function createPasswordReset(userId, tokenHash, expiresAt) {
  db.prepare("DELETE FROM password_resets WHERE user_id = ?").run(userId);
  db.prepare(
    "INSERT INTO password_resets (token_hash, user_id, expires_at) VALUES (?, ?, ?)",
  ).run(tokenHash, userId, expiresAt);
}

export function findPasswordReset(tokenHash) {
  return db
    .prepare(
      "SELECT user_id, expires_at FROM password_resets WHERE token_hash = ? AND expires_at > ?",
    )
    .get(tokenHash, Date.now());
}

export function findPasswordResetByUser(userId) {
  return db
    .prepare("SELECT expires_at FROM password_resets WHERE user_id = ? AND expires_at > ?")
    .get(userId, Date.now());
}

// Sets the new password, burns every reset link and signs the account out
// everywhere, since whoever knew the old password may still hold a session.
export function resetPassword(userId, passwordHash) {
  db.prepare("UPDATE users SET password_hash = ? WHERE id = ?").run(passwordHash, userId);
  db.prepare("DELETE FROM password_resets WHERE user_id = ?").run(userId);
  db.prepare("DELETE FROM sessions WHERE user_id = ?").run(userId);
}
