import { createI18n } from "vue-i18n";
import en from "./locales/en";
import pt from "./locales/pt";

// The codes double as the Intl locale for dates and numbers, which is why
// English is en-GB (day/month order) rather than plain "en".
export const SUPPORTED_LOCALES = [
  { code: "en-GB", label: "EN", name: "English" },
  { code: "pt-PT", label: "PT", name: "Português" },
];

export const LOCALE_STORAGE_KEY = "spacex-dashboard:locale";

const DEFAULT_LOCALE = "en-GB";

export function isSupportedLocale(code) {
  return SUPPORTED_LOCALES.some((locale) => locale.code === code);
}

// A saved choice wins; otherwise follow the browser's language.
function loadLocale() {
  try {
    const stored = localStorage.getItem(LOCALE_STORAGE_KEY);
    if (isSupportedLocale(stored)) return stored;
  } catch (err) {}
  return navigator.language?.toLowerCase().startsWith("pt")
    ? "pt-PT"
    : DEFAULT_LOCALE;
}

const date = { day: "2-digit", month: "2-digit", year: "numeric" };
const time = { hour: "2-digit", minute: "2-digit" };

// pt-PT renders a "short" month as digits (24/03/2026), so Portuguese spells
// the month out instead: "24 de março de 2026 às 22:30".
const datetimeFormats = {
  "en-GB": {
    date,
    dateTime: { day: "2-digit", month: "short", year: "numeric", ...time },
  },
  "pt-PT": {
    date,
    dateTime: { day: "numeric", month: "long", year: "numeric", ...time },
  },
};

const numberFormat = {
  usd: {
    style: "currency",
    currency: "USD",
    currencyDisplay: "narrowSymbol",
    maximumFractionDigits: 0,
  },
};

export const i18n = createI18n({
  legacy: false,
  locale: loadLocale(),
  fallbackLocale: DEFAULT_LOCALE,
  messages: { "en-GB": en, "pt-PT": pt },
  datetimeFormats,
  numberFormats: { "en-GB": numberFormat, "pt-PT": numberFormat },
});
