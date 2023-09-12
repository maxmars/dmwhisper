import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  // detect user language
  // learn more: https://github.com/i18next/i18next-browser-languageDetector
  .use(LanguageDetector)
  // pass the i18n instance to react-i18next.
  .use(initReactI18next)
  // init i18next
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    debug: true,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
    resources: {
      en: {
        translation: {
          // here we will place our translations, e.g.: myKey: 'text for translation'
          "Edit content tree": "Edit content tree",
          "Edit content tables": "Edit content tables",
          "Copy content as JSON to clipboard": "Copy content as JSON to clipboard",
          "Paste JSON and parse as content": "Paste JSON and parse as content",
        }
      },
      it: {
        translation: {
          // here we will place our translations, e.g.: myKey: 'text for translation'
          "Edit content tree": "Modifica l'albero dei contenuti",
          "Edit content tables": "Modifica le tabelle dei contenuti",
          "Copy content as JSON to clipboard": "Copia contenuto negli appunti",
          "Paste JSON and parse as content": "Incolla un testo JSON per importarlo",
        }
      },
    }
  });

export default i18n;
