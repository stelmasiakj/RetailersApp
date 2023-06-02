import {getLocales} from 'react-native-localize';

export const getLanguage = async () => {
  const languageCode = getLocales()[0].languageCode;
  return languageCode;
};
