import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {APP_HEADER_HEIGHT} from './app.header.constants';

export const useAppHeaderHeight = (args?: {
  includeTopSafeAreaInset: boolean;
}) => {
  const includeTopSafeAreaInset = args?.includeTopSafeAreaInset || true;

  const {top} = useSafeAreaInsets();

  return APP_HEADER_HEIGHT + (includeTopSafeAreaInset ? top : 0);
};
