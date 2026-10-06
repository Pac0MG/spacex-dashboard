import { createServer } from "node:http";
import { createHash, randomBytes } from "node:crypto";
import {
  createPasswordReset,
  createSession,
  createUser,
  deleteExpiredSessions,
  deleteSession,
  deleteUser,
  findConflicts,
  findPasswordReset,
  findPasswordResetByUser,
  findUserByEmail,
  findUserByIdentifier,
  findUserBySession,
  resetPassword,
  updateAvatar,
} from "./db.js";
import { sendPasswordResetEmail } from "./mail.js";
import { hashPassword, verifyPassword } from "./password.js";

const PORT = Number(process.env.PORT) || 3001;
const SESSION_COOKIE = "session";
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000;
// Sign-up carries the profile photo (a small base64 image), so it needs more
// room than a plain JSON body.
const MAX_BODY_BYTES = 400 * 1024;
const MAX_AVATAR_CHARS = 300 * 1024;
const PASSWORD_MIN = 9;
const PASSWORD_MAX = 128;
const RESET_TTL_MS = 60 * 60 * 1000;
// Asking again within this window doesn't send another email.
const RESET_COOLDOWN_MS = 60 * 1000;
// Where the emailed link points. Set APP_URL when the app isn't on Vite's
// default port; never derive it from the request's Host header.
const APP_URL = (process.env.APP_URL || "http://localhost:5173").replace(/\/$/, "");

const USERNAME_RE = /^[a-zA-Z0-9_.-]{3,30}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Raster formats only (no SVG), since the value ends up in an <img src>.
const AVATAR_RE = /^data:image\/(?:jpeg|png|webp);base64,[A-Za-z0-9+/]+=*$/;

// Same rules as src/utils/passwordRules.js, which shows them while typing.
function passwordError(password) {
  if (
    password.length < PASSWORD_MIN ||
    password.length > PASSWORD_MAX ||
    !/\p{Lu}/u.test(password) ||
    !/[^\p{L}\p{N}\s]/u.test(password)
  ) {
    return `Password must be ${PASSWORD_MIN}-${PASSWORD_MAX} characters and include at least 1 uppercase letter and 1 special character.`;
  }
  return null;
}

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

// Returns an error message, or null when the photo is acceptable.
function avatarError(avatar) {
  if (avatar.length > MAX_AVATAR_CHARS || !AVATAR_RE.test(avatar)) {
    return "The photo must be a JPEG, PNG or WebP image.";
  }
  return null;
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
  if (passwordError(password)) {
    errors.password = passwordError(password);
  }
  if (avatar && avatarError(avatar)) {
    errors.avatar = avatarError(avatar);
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

function hashToken(token) {
  return createHash("sha256").update(token).digest("hex");
}

// Always answers the same way, whether or not the email has an account, so the
// form can't be used to find out who is registered.
async function forgotPassword(req, res) {
  const body = await readJson(req);
  const email = asString(body.email).toLowerCase();

  if (!EMAIL_RE.test(email) || email.length > 254) {
    return send(res, 400, { error: "Enter a valid email address." });
  }

  const user = findUserByEmail(email);
  const recent = user && findPasswordResetByUser(user.id);
  const requestedJustNow =
    recent && recent.expires_at > Date.now() + RESET_TTL_MS - RESET_COOLDOWN_MS;

  if (user && !requestedJustNow) {
    const token = randomBytes(32).toString("hex");
    createPasswordReset(user.id, hashToken(token), Date.now() + RESET_TTL_MS);

    // Not awaited: the reply must not take longer for real accounts.
    sendPasswordResetEmail({
      to: user.email,
      name: user.name,
      link: `${APP_URL}/reset-password?token=${token}`,
    }).catch((err) => console.error("Could not send reset email:", err.message));
  }

  send(res, 200, { ok: true });
}

async function resetPasswordHandler(req, res) {
  const body = await readJson(req);
  const token = typeof body.token === "string" ? body.token : "";
  const password = typeof body.password === "string" ? body.password : "";

  const message = passwordError(password);
  if (message) {
    return send(res, 400, { error: message, errors: { password: message } });
  }

  const reset = token && findPasswordReset(hashToken(token));
  if (!reset) {
    return send(res, 400, {
      error: "This reset link is invalid or has expired. Request a new one.",
    });
  }

  resetPassword(reset.user_id, await hashPassword(password));
  send(res, 200, { ok: true });
}

function logout(req, res) {
  const token = getCookie(req, SESSION_COOKIE);
  if (token) deleteSession(token);
  send(res, 200, { ok: true }, { "Set-Cookie": sessionCookie("", 0) });
}

// Replies 401 and returns null when there's no valid session.
function requireUser(req, res) {
  const token = getCookie(req, SESSION_COOKIE);
  const user = token && findUserBySession(token);
  if (!user) send(res, 401, { error: "Not authenticated." });
  return user || null;
}

function me(req, res) {
  const user = requireUser(req, res);
  if (user) send(res, 200, { user: publicUser(user) });
}

// Body: { avatar: "data:image/..." } to set the photo, or { avatar: null } to
// remove it. Nothing else about the account can be changed here.
async function changeAvatar(req, res) {
  const user = requireUser(req, res);
  if (!user) return;

  const body = await readJson(req);
  const avatar = typeof body.avatar === "string" ? body.avatar : null;

  const error = avatar && avatarError(avatar);
  if (error) return send(res, 400, { error, errors: { avatar: error } });

  send(res, 200, { user: publicUser(updateAvatar(user.id, avatar)) });
}

// The password is asked for again so a hijacked session can't wipe the account.
async function deleteAccount(req, res) {
  const user = requireUser(req, res);
  if (!user) return;

  const body = await readJson(req);
  const password = typeof body.password === "string" ? body.password : "";

  if (!(await verifyPassword(password.slice(0, PASSWORD_MAX), user.password_hash))) {
    return send(res, 403, { error: "Incorrect password." });
  }

  deleteUser(user.id);
  send(res, 200, { ok: true }, { "Set-Cookie": sessionCookie("", 0) });
}

const routes = {
  "POST /api/auth/signup": signup,
  "POST /api/auth/login": login,
  "POST /api/auth/forgot-password": forgotPassword,
  "POST /api/auth/reset-password": resetPasswordHandler,
  "POST /api/auth/logout": logout,
  "GET /api/auth/me": me,
  "PUT /api/auth/me/avatar": changeAvatar,
  "DELETE /api/auth/me": deleteAccount,
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
