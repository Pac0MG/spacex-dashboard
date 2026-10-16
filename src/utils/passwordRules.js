// Mirrors the checks in server/index.js; the server has the final say.
// `labelKey` is an i18n key (password.rules.*).
export const PASSWORD_RULES = [
  {
    id: "length",
    labelKey: "password.rules.length",
    test: (password) => password.length >= 9,
  },
  {
    id: "uppercase",
    labelKey: "password.rules.uppercase",
    test: (password) => /\p{Lu}/u.test(password),
  },
  {
    id: "special",
    labelKey: "password.rules.special",
    test: (password) => /[^\p{L}\p{N}\s]/u.test(password),
  },
];

export function meetsPasswordRules(password) {
  return PASSWORD_RULES.every((rule) => rule.test(password));
}
