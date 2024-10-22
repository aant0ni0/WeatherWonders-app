import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "./locales/en/translation.json";
import pl from "./locales/pl/translation.json";

const fallbackLng = "en";
const availableLanguages = ["en", "pl"];

const deviceLanguage = Intl.DateTimeFormat()
  .resolvedOptions()
  .locale.split("-")[0];

const language = availableLanguages.includes(deviceLanguage)
  ? deviceLanguage
  : fallbackLng;

const resources = {
  en: { translation: en },
  pl: { translation: pl },
};

i18n.use(initReactI18next).init({
  compatibilityJSON: "v3",
  resources,
  lng: language,
  fallbackLng,
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
