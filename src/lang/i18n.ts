import i18next from 'i18next';
import {initReactI18next} from 'react-i18next';
import {languageDetector} from './language.detector';
import en from './en.json';

export const defaultNS = 'translation';
export const fallbackLng = 'en';
export const supportedLngs = ['en'] as const;
export const resources = {
  en: {
    translation: en,
  },
};
export const ns = ['translation'];

i18next
  .use(languageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng,
    supportedLngs,
    ns,
    defaultNS,
    compatibilityJSON: 'v3',
    resources,
    react: {
      useSuspense: false,
    },
  });
