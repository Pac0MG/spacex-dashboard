// Only allow same-site paths as post-login targets (blocks "//evil.com" and
// absolute URLs). Falls back to the Launches page.
export function safeRedirect(target, fallback = "/launches") {
  if (typeof target !== "string") return fallback;
  if (!target.startsWith("/") || target.startsWith("//")) return fallback;
  if (target.startsWith("/login") || target.startsWith("/signup")) {
    return fallback;
  }
  return target;
}
