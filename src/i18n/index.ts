import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import { getLocales } from 'expo-localization';

import en from './en.json';
import es from './es.json';

// Usa el idioma del dispositivo si es inglés; para cualquier otro, cae a español.
const deviceLang = getLocales()[0]?.languageCode ?? 'es';
const initialLang = deviceLang === 'en' ? 'en' : 'es';

void i18next.use(initReactI18next).init({
  lng: initialLang,
  fallbackLng: 'es',
  resources: {
    en: { translation: en },
    es: { translation: es },
  },
  interpolation: {
    escapeValue: false, // React ya escapa los valores — no hace falta escapar aquí
  },
});

export default i18next;
