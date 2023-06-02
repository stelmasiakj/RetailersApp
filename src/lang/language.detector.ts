import {LanguageDetectorAsyncModule} from 'i18next';
import {getLanguage} from './get.language';

export const languageDetector: LanguageDetectorAsyncModule = {
  type: 'languageDetector',
  async: true,
  detect: (callback: (l: string) => void) => {
    getLanguage().then(lang => {
      callback(lang);
    });
  },
  init: () => {},
  cacheUserLanguage: () => {},
};
