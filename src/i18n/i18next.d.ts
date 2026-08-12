// Augmenta los tipos de i18next con las claves reales de en.json.
// Si escribes t('clave.que.no.existe'), TypeScript lo marca como error.
import 'i18next';

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'translation';
    resources: {
      translation: typeof import('./en.json');
    };
  }
}
