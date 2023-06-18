import {useCallback, useContext} from 'react';
import {CustomTabBarTranslateContext} from './custom.tab.bar.translate.context';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {TABBAR_HEIGHT} from './constants';
import {withTiming} from 'react-native-reanimated';

export const useCustomTabBarTranslate = () => {
  const {translateY} = useContext(CustomTabBarTranslateContext);
  return translateY;
};

export const useCustomTabbarHeight = () => {
  const {bottom} = useSafeAreaInsets();
  return bottom + TABBAR_HEIGHT;
};

export const useShowTabBar = () => {
  const translateY = useCustomTabBarTranslate();
  return useCallback(() => {
    translateY.value = withTiming(0);
  }, [translateY]);
};

export const useHideTabBar = () => {
  const translateY = useCustomTabBarTranslate();
  const tabbarHeight = useCustomTabbarHeight();
  return useCallback(() => {
    translateY.value = withTiming(tabbarHeight);
  }, [translateY, tabbarHeight]);
};
