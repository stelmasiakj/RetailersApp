import {buildSecureStorage} from '~/utils';

const STORAGE_KEY = 'token';

export const tokenStorage = buildSecureStorage(STORAGE_KEY);
