import {BottomTabBarProps} from '@react-navigation/bottom-tabs';
import {useStylesheet} from '~/designSystem';
import {TABBAR_HEIGHT} from './constants';
import Animated, {useAnimatedStyle} from 'react-native-reanimated';
import {View} from 'react-native';
import {useCallback} from 'react';
import type {AppTabsNavigatorParams} from '~/navigation/app.tabs.navigator';
import {CustomTabBarItem} from './custom.tab.bar.item';
import {useCustomTabBarTranslate} from './custom.tab.bar.hooks';

export const CustomTabBar = ({
  descriptors,
  insets: {bottom},
  navigation,
  state,
}: BottomTabBarProps) => {
  const styles = useStylesheet(
    ({colors}) => ({
      wrapper: {
        paddingBottom: bottom,
        backgroundColor: colors.elevation.level2,
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
      },
      container: {
        height: TABBAR_HEIGHT,
        flexDirection: 'row',
      },
    }),
    [bottom],
  );
  type TRoute = (typeof state.routes)[number];
  const translateY = useCustomTabBarTranslate();

  const animatedStyle = useAnimatedStyle(
    () => ({
      transform: [{translateY: translateY.value}],
    }),
    [],
  );

  const renderRoute = useCallback(
    (route: TRoute, index: number) => {
      const {options} = descriptors[route.key];

      const routeName = route.name as keyof AppTabsNavigatorParams;
      const routeKey = route.key;
      const isFocused = state.index === index;
      const icon = options.tabBarIcon;
      return (
        <CustomTabBarItem
          testID={`TabBar_${routeName}`}
          key={routeKey}
          navigation={navigation}
          routeName={routeName}
          routeKey={routeKey}
          isFocused={isFocused}
          icon={icon}
        />
      );
    },
    [navigation, descriptors, state.index],
  );

  return (
    <Animated.View style={[styles.wrapper, animatedStyle]}>
      <View style={styles.container}>{state.routes.map(renderRoute)}</View>
    </Animated.View>
  );
};
