import { i18n } from "../i18n";

function unreachableError() {
  return new Error(i18n.global.t("errors.authUnreachable"));
}

// Plain fetch on purpose: auth errors are shown inline on the login / sign-up
// forms, not through the toast interceptor used for the SpaceX API client.
async function request(path, options = {}) {
  const response = await fetch(`/api/auth${path}`, {
    credentials: "same-origin",
    // The server answers its error messages (and the reset email) in this language.
    headers: {
      "Content-Type": "application/json",
      "Accept-Language": i18n.global.locale.value,
    },
    ...options,
  }).catch(() => {
    throw unreachableError();
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    // The dev proxy answers 502/503/504 (with no JSON body) when the auth
    // API isn't running.
    if (!data.error && response.status >= 502) throw unreachableError();

    throw Object.assign(new Error(data.error || i18n.global.t("errors.generic")), {
      status: response.status,
      fieldErrors: data.errors || {},
    });
  }

  return data;
}

export function fetchCurrentUser() {
  return request("/me");
}

export function loginRequest(identifier, password) {
  return request("/login", {
    method: "POST",
    body: JSON.stringify({ identifier, password }),
  });
}

export function signupRequest(payload) {
  return request("/signup", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function forgotPasswordRequest(email) {
  return request("/forgot-password", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

export function resetPasswordRequest(token, password) {
  return request("/reset-password", {
    method: "POST",
    body: JSON.stringify({ token, password }),
  });
}

export function logoutRequest() {
  return request("/logout", { method: "POST" });
}

export function updateAvatarRequest(avatar) {
  return request("/me/avatar", {
    method: "PUT",
    body: JSON.stringify({ avatar }),
  });
}

export function deleteAccountRequest(password) {
  return request("/me", {
    method: "DELETE",
    body: JSON.stringify({ password }),
  });
}
