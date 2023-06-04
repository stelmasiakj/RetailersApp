import {useAppHeaderHeight} from '~/components';
import {TABBAR_HEIGHT} from '~/navigationElements/constants';

export const useHeaderHeight = () => {
  const appHeaderHeight = useAppHeaderHeight();
  return TABBAR_HEIGHT + appHeaderHeight;
};
