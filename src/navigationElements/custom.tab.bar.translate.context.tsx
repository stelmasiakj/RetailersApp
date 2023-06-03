import React, {createContext, useContext, useMemo} from 'react';
import Animated, {useSharedValue} from 'react-native-reanimated';

interface ICustomTabBarTranslateContextValue {
  translateY: Animated.SharedValue<number>;
}

const CustomTabBarTranslateContext =
  createContext<ICustomTabBarTranslateContextValue>({
    translateY: null as any,
  });

export const CustomTabBarTranslateProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const translateY = useSharedValue(0);
  const value = useMemo<ICustomTabBarTranslateContextValue>(
    () => ({translateY}),
    [translateY],
  );
  return (
    <CustomTabBarTranslateContext.Provider value={value}>
      {children}
    </CustomTabBarTranslateContext.Provider>
  );
};

export const useCustomTabBarTranslate = () => {
  const {translateY} = useContext(CustomTabBarTranslateContext);
  return translateY;
};
