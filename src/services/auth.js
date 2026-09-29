const UNREACHABLE_MESSAGE =
  "Can't reach the auth server. Make sure it's running (npm run server).";

// Plain fetch on purpose: auth errors are shown inline on the login / sign-up
// forms, not through the toast interceptor used for the SpaceX API client.
async function request(path, options = {}) {
  const response = await fetch(`/api/auth${path}`, {
    credentials: "same-origin",
    headers: { "Content-Type": "application/json" },
    ...options,
  }).catch(() => {
    throw new Error(UNREACHABLE_MESSAGE);
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    // The dev proxy answers 502/503/504 (with no JSON body) when the auth
    // API isn't running.
    const message = data.error
      ? data.error
      : response.status >= 502
        ? UNREACHABLE_MESSAGE
        : "Something went wrong.";

    throw Object.assign(new Error(message), {
      status: response.status,
      fieldErrors: data.errors || {},
    });
  }

  return data;
}

export function fetchCurrentUser() {
  return request("/me");
}

export function loginRequest(identifier) {
  return request("/login", {
    method: "POST",
    body: JSON.stringify({ identifier }),
  });
}

export function signupRequest(payload) {
  return request("/signup", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function logoutRequest() {
  return request("/logout", { method: "POST" });
}
