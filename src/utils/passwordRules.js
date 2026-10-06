// Mirrors the checks in server/index.js; the server has the final say.
export const PASSWORD_RULES = [
  {
    id: "length",
    label: "At least 9 characters",
    test: (password) => password.length >= 9,
  },
  {
    id: "uppercase",
    label: "At least 1 uppercase letter",
    test: (password) => /\p{Lu}/u.test(password),
  },
  {
    id: "special",
    label: "At least 1 special character (e.g. ! @ # $ %)",
    test: (password) => /[^\p{L}\p{N}\s]/u.test(password),
  },
];

export function meetsPasswordRules(password) {
  return PASSWORD_RULES.every((rule) => rule.test(password));
}
