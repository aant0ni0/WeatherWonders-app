import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import * as Localization from "react-native-localize";

import en from "./locales/en/translation.json";
import pl from "./locales/pl/translation.json";

const resources = {
  en: { translation: en },
  pl: { translation: pl },
};

const languageDetector = {
  type: "languageDetector" as const,
  async: true,
  detect: (callback: (lang: string) => void) => {
    const locales = Localization.getLocales();
    const bestLanguage = locales.find((locale) =>
      Object.keys(resources).includes(locale.languageTag)
    );

    callback(bestLanguage?.languageTag || "en");
  },
  init: () => {},
  cacheUserLanguage: () => {},
};

i18n
  .use(languageDetector)
  .use(initReactI18next)
  .init({
    compatibilityJSON: "v3",
    resources,
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
