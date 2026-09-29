import { randomBytes, scrypt, timingSafeEqual } from "node:crypto";

const KEY_LENGTH = 64;
const SALT_BYTES = 16;

function derive(password, salt) {
  return new Promise((resolve, reject) => {
    scrypt(password, salt, KEY_LENGTH, (err, key) => {
      if (err) reject(err);
      else resolve(key);
    });
  });
}

// Stored as "<salt hex>:<key hex>".
export async function hashPassword(password) {
  const salt = randomBytes(SALT_BYTES);
  const key = await derive(password, salt);
  return `${salt.toString("hex")}:${key.toString("hex")}`;
}

// Hash of a throwaway password, compared against when the account doesn't
// exist (or has no password) so a failed login takes the same time either way.
const DUMMY_HASH = await hashPassword(randomBytes(16).toString("hex"));

export async function verifyPassword(password, stored) {
  const [saltHex, keyHex] = (stored || DUMMY_HASH).split(":");
  const expected = Buffer.from(keyHex, "hex");
  const actual = await derive(password, Buffer.from(saltHex, "hex"));
  return Boolean(stored) && timingSafeEqual(actual, expected);
}
