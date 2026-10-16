import { defineStore } from "pinia";
import { watch } from "vue";
import {
  i18n,
  isSupportedLocale,
  LOCALE_STORAGE_KEY,
  SUPPORTED_LOCALES,
} from "../../i18n";

export const useLocaleStore = defineStore("locale", () => {
  // The i18n instance owns the value; this store only persists and switches it.
  const locale = i18n.global.locale;

  function applyToDocument() {
    document.documentElement.lang = locale.value;
  }
  applyToDocument();

  watch(locale, (value) => {
    applyToDocument();

    try {
      localStorage.setItem(LOCALE_STORAGE_KEY, value);
    } catch (err) {}
  });

  function setLocale(code) {
    if (isSupportedLocale(code)) locale.value = code;
  }

  return {
    locale,
    locales: SUPPORTED_LOCALES,
    setLocale,
  };
});
