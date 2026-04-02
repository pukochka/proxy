import { createI18n } from 'vue-i18n';

import ru from './locales/ru';
import en from './locales/en';

export type AppLocale = 'ru' | 'en';

export function proxyLanguageToLocale(lang: ProxyUser['language']): AppLocale {
  return lang === 'ru' ? 'ru' : 'en';
}

export const i18n = createI18n({
  legacy: false,
  locale: 'ru',
  fallbackLocale: 'ru',
  globalInjection: true,
  messages: {
    ru,
    en,
  },
});
