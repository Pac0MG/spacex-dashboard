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
}
