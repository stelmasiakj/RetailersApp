import ReactNativeConfig from 'react-native-config';

type TConfig = {
  APP_DISPLAY_NAME: string;
  APP_VERSION: string;
  APP_API_URL: string;
};

const Config = {
  ...ReactNativeConfig,
} as TConfig;

export {Config};
