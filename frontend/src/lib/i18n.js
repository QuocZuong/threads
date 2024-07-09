import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import Backend from "i18next-http-backend";
import translationEn from "../assets/locales/en";
import translationVi from "../assets/locales/vi";
import deleteModalEnTranslation from "../assets/locales/en/deleteModal";
import deleteModalViTranslation from "../assets/locales/vi/deleteModal";

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "en",
    debug: true,
    backend: {
      loadPath: "/locales/{{lng}}/{{ns}}.json",
    },
    detection: {
      order: ["queryString", "cookie"],
      caches: ["cookie"],
    },
    interpolation: {
      escapeValue: false, // React already safes from xss
    },
    resources: {
      en: {
        translation: translationEn,
        deleteModal: deleteModalEnTranslation,
      },
      vn: {
        translation: translationVi,
        deleteModal: deleteModalViTranslation,
      },
    },
  });

export default i18n;
