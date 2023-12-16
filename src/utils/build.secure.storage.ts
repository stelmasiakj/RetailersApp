import {
  getAllGenericPasswordServices,
  resetGenericPassword,
  getGenericPassword,
  setGenericPassword,
} from 'react-native-keychain';
import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYCHAIN_SALT_AS_KEY = 'KEYCHAIN_SALT';

const KEYCHAIN_USERNAME = 'RetailersApp';

const generateKeychainSalt = () => {
  return Math.round(Math.random() * 10000).toString();
};

const getKeychainKeySalt = async () => {
  const salt = await AsyncStorage.getItem(KEYCHAIN_SALT_AS_KEY);
  if (salt) {
    return salt;
  } else {
    await clearKeychain();
    const newSalt = generateKeychainSalt();
    await AsyncStorage.setItem(KEYCHAIN_SALT_AS_KEY, newSalt);
    return newSalt;
  }
};

const clearKeychain = async () => {
  const services = await getAllGenericPasswordServices();
  for (let service of services) {
    await resetGenericPassword({service});
  }
};

const getKeychainKey = async (key: string) => {
  const salt = await getKeychainKeySalt();

  return `${key}_${salt}`;
};

const writeSecure = async (key: string, value: string) => {
  const keychainKey = await getKeychainKey(key);

  if (!value) {
    if (await readSecure(keychainKey)) {
      await clearSecure(keychainKey);
    }
    return;
  }
  await setGenericPassword(KEYCHAIN_USERNAME, value, {
    service: keychainKey,
  });
};

const readSecure = async (key: string) => {
  const keychainKey = await getKeychainKey(key);
  const result = await getGenericPassword({service: keychainKey});
  if (result) {
    return result.password;
  }
  return undefined;
};

const clearSecure = async (key: string) => {
  const keychainKey = await getKeychainKey(key);
  await resetGenericPassword({service: keychainKey});
};

export const buildSecureStorage = (key: string) => ({
  write: (value: string) => writeSecure(key, value),
  read: () => readSecure(key),
  clear: () => clearSecure(key),
});
