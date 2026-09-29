import { createServer } from "node:http";
import { randomBytes } from "node:crypto";
import {
  createSession,
  createUser,
  deleteExpiredSessions,
  deleteSession,
  findConflicts,
  findUserByIdentifier,
  findUserBySession,
} from "./db.js";
import { hashPassword, verifyPassword } from "./password.js";

const PORT = Number(process.env.PORT) || 3001;
const SESSION_COOKIE = "session";
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000;
// Sign-up carries the profile photo (a small base64 image), so it needs more
// room than a plain JSON body.
const MAX_BODY_BYTES = 400 * 1024;
const MAX_AVATAR_CHARS = 300 * 1024;
const PASSWORD_MIN = 8;
const PASSWORD_MAX = 128;

const USERNAME_RE = /^[a-zA-Z0-9_.-]{3,30}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Raster formats only (no SVG), since the value ends up in an <img src>.
const AVATAR_RE = /^data:image\/(?:jpeg|png|webp);base64,[A-Za-z0-9+/]+=*$/;

function publicUser(user) {
  return {
    id: user.id,
    name: user.name,
    username: user.username,
    email: user.email,
    avatar: user.avatar,
  };
}

function send(res, status, body, headers = {}) {
  res.writeHead(status, { "Content-Type": "application/json", ...headers });
  res.end(JSON.stringify(body));
}

function readJson(req) {
  return new Promise((resolve, reject) => {
    let size = 0;
    const chunks = [];

    req.on("data", (chunk) => {
      size += chunk.length;
      if (size > MAX_BODY_BYTES) {
        reject(Object.assign(new Error("Request too large."), { status: 413 }));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });

    req.on("end", () => {
      try {
        const raw = Buffer.concat(chunks).toString("utf8");
        resolve(raw ? JSON.parse(raw) : {});
      } catch {
        reject(Object.assign(new Error("Invalid JSON."), { status: 400 }));
      }
    });

    req.on("error", reject);
  });
}

function getCookie(req, name) {
  const header = req.headers.cookie || "";
  for (const part of header.split(";")) {
    const [key, ...rest] = part.trim().split("=");
    if (key === name) return decodeURIComponent(rest.join("="));
  }
  return null;
}

function sessionCookie(token, maxAgeSeconds) {
  return `${SESSION_COOKIE}=${token}; HttpOnly; SameSite=Lax; Path=/; Max-Age=${maxAgeSeconds}`;
}

function startSession(res, user, status) {
  const token = randomBytes(32).toString("hex");
  createSession(token, user.id, Date.now() + SESSION_TTL_MS);
  send(
    res,
    status,
    { user: publicUser(user) },
    { "Set-Cookie": sessionCookie(token, SESSION_TTL_MS / 1000) },
  );
}

function asString(value) {
  return typeof value === "string" ? value.trim() : "";
}

async function signup(req, res) {
  const body = await readJson(req);
  const name = asString(body.name);
  const username = asString(body.username);
  const email = asString(body.email).toLowerCase();
  const password = typeof body.password === "string" ? body.password : "";
  const avatar = typeof body.avatar === "string" ? body.avatar : null;

  const errors = {};
  if (name.length < 2 || name.length > 100) {
    errors.name = "Name must be between 2 and 100 characters.";
  }
  if (!USERNAME_RE.test(username)) {
    errors.username =
      "Username must be 3-30 characters: letters, numbers, dots, dashes or underscores.";
  }
  if (!EMAIL_RE.test(email) || email.length > 254) {
    errors.email = "Enter a valid email address.";
  }
  if (password.length < PASSWORD_MIN || password.length > PASSWORD_MAX) {
    errors.password = `Password must be between ${PASSWORD_MIN} and ${PASSWORD_MAX} characters.`;
  }
  if (avatar && (avatar.length > MAX_AVATAR_CHARS || !AVATAR_RE.test(avatar))) {
    errors.avatar = "The photo must be a JPEG, PNG or WebP image.";
  }

  if (Object.keys(errors).length) {
    return send(res, 400, { error: "Please fix the highlighted fields.", errors });
  }

  for (const existing of findConflicts({ username, email })) {
    if (existing.username.toLowerCase() === username.toLowerCase()) {
      errors.username = "This username is already taken.";
    }
    if (existing.email === email) {
      errors.email = "An account with this email already exists.";
    }
  }

  if (Object.keys(errors).length) {
    return send(res, 409, { error: "Account already exists.", errors });
  }

  try {
    const passwordHash = await hashPassword(password);
    startSession(
      res,
      createUser({ name, username, email, passwordHash, avatar: avatar || null }),
      201,
    );
  } catch (err) {
    // Lost a race with a concurrent signup on the UNIQUE constraints.
    if (String(err.message).includes("UNIQUE")) {
      return send(res, 409, { error: "Username or email is already in use." });
    }
    throw err;
  }
}

async function login(req, res) {
  const body = await readJson(req);
  const identifier = asString(body.identifier);
  const password = typeof body.password === "string" ? body.password : "";

  if (!identifier || !password) {
    return send(res, 400, {
      error: "Enter your email or username and your password.",
    });
  }

  const user = findUserByIdentifier(identifier);
  const valid = await verifyPassword(
    password.slice(0, PASSWORD_MAX),
    user?.password_hash,
  );

  // One message for both cases so the form doesn't reveal which accounts exist.
  if (!user || !valid) {
    return send(res, 401, { error: "Incorrect email, username or password." });
  }

  startSession(res, user, 200);
}

function logout(req, res) {
  const token = getCookie(req, SESSION_COOKIE);
  if (token) deleteSession(token);
  send(res, 200, { ok: true }, { "Set-Cookie": sessionCookie("", 0) });
}

function me(req, res) {
  const token = getCookie(req, SESSION_COOKIE);
  const user = token && findUserBySession(token);
  if (!user) return send(res, 401, { error: "Not authenticated." });
  send(res, 200, { user: publicUser(user) });
}

const routes = {
  "POST /api/auth/signup": signup,
  "POST /api/auth/login": login,
  "POST /api/auth/logout": logout,
  "GET /api/auth/me": me,
};

const server = createServer(async (req, res) => {
  const path = new URL(req.url, "http://localhost").pathname;
  const handler = routes[`${req.method} ${path}`];

  if (!handler) return send(res, 404, { error: "Not found." });

  try {
    await handler(req, res);
  } catch (err) {
    if (res.headersSent) return;
    if (err.status) return send(res, err.status, { error: err.message });
    console.error(err);
    send(res, 500, { error: "Internal server error." });
  }
});

deleteExpiredSessions();
setInterval(deleteExpiredSessions, 60 * 60 * 1000).unref();

// Loopback only: the Vite dev server proxies /api here.
server.listen(PORT, "127.0.0.1", () => {
  console.log(`Auth API running at http://localhost:${PORT}`);
});
