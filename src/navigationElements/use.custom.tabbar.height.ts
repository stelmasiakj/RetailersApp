import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {TABBAR_HEIGHT} from './constants';

export const useCustomTabbarHeight = () => {
  const {bottom} = useSafeAreaInsets();
  return bottom + TABBAR_HEIGHT;
};
