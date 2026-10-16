// Error messages and the reset email, in the language the client asks for via
// Accept-Language (src/services/auth.js sends the UI's current locale). UI text
// lives in src/i18n/locales; only what the server itself says is here.
const MESSAGES = {
  en: {
    requestTooLarge: "Request too large.",
    invalidJson: "Invalid JSON.",
    notFound: "Not found.",
    internalError: "Internal server error.",
    notAuthenticated: "Not authenticated.",
    passwordRules:
      "Password must be {min}-{max} characters and include at least 1 uppercase letter and 1 special character.",
    avatarInvalid: "The photo must be a JPEG, PNG or WebP image.",
    nameLength: "Name must be between 2 and 100 characters.",
    usernameInvalid:
      "Username must be 3-30 characters: letters, numbers, dots, dashes or underscores.",
    emailInvalid: "Enter a valid email address.",
    fixFields: "Please fix the highlighted fields.",
    usernameTaken: "This username is already taken.",
    emailTaken: "An account with this email already exists.",
    accountExists: "Account already exists.",
    usernameOrEmailInUse: "Username or email is already in use.",
    loginMissing: "Enter your email or username and your password.",
    loginInvalid: "Incorrect email, username or password.",
    resetInvalid: "This reset link is invalid or has expired. Request a new one.",
    incorrectPassword: "Incorrect password.",
    resetEmailSubject: "Reset your SpaceX Dashboard password",
    resetEmailGreeting: "Hi {name},",
    resetEmailIntro: "We received a request to reset your SpaceX Dashboard password.",
    resetEmailAction: "Open this link to choose a new one (valid for 1 hour):",
    resetEmailIgnore: "If you didn't ask for this, you can ignore this email.",
  },
  pt: {
    requestTooLarge: "Pedido demasiado grande.",
    invalidJson: "JSON inválido.",
    notFound: "Não encontrado.",
    internalError: "Erro interno do servidor.",
    notAuthenticated: "Sessão não iniciada.",
    passwordRules:
      "A palavra-passe tem de ter {min}-{max} caracteres e incluir pelo menos 1 letra maiúscula e 1 carácter especial.",
    avatarInvalid: "A fotografia tem de ser uma imagem JPEG, PNG ou WebP.",
    nameLength: "O nome tem de ter entre 2 e 100 caracteres.",
    usernameInvalid:
      "O nome de utilizador tem de ter 3-30 caracteres: letras, números, pontos, hífenes ou underscores.",
    emailInvalid: "Introduz um endereço de email válido.",
    fixFields: "Corrige os campos assinalados.",
    usernameTaken: "Este nome de utilizador já está a ser usado.",
    emailTaken: "Já existe uma conta com este email.",
    accountExists: "A conta já existe.",
    usernameOrEmailInUse: "O nome de utilizador ou o email já estão a ser usados.",
    loginMissing: "Introduz o teu email ou nome de utilizador e a palavra-passe.",
    loginInvalid: "Email, nome de utilizador ou palavra-passe incorretos.",
    resetInvalid:
      "Esta ligação de reposição é inválida ou expirou. Pede uma nova.",
    incorrectPassword: "Palavra-passe incorreta.",
    resetEmailSubject: "Repõe a tua palavra-passe do SpaceX Dashboard",
    resetEmailGreeting: "Olá {name},",
    resetEmailIntro:
      "Recebemos um pedido para repor a tua palavra-passe do SpaceX Dashboard.",
    resetEmailAction:
      "Abre esta ligação para escolheres uma nova (válida durante 1 hora):",
    resetEmailIgnore: "Se não foste tu a pedir, podes ignorar este email.",
  },
};

// Only the first language tag counts; anything that isn't Portuguese is English.
export function localeFrom(req) {
  const first = (req.headers["accept-language"] || "").split(",")[0];
  return first.trim().toLowerCase().startsWith("pt") ? "pt" : "en";
}

export function t(locale, key, params = {}) {
  const template = MESSAGES[locale]?.[key] ?? MESSAGES.en[key] ?? key;
  return template.replace(/\{(\w+)\}/g, (match, name) =>
    name in params ? String(params[name]) : match,
  );
}
