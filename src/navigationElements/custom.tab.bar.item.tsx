import React, {useCallback, useEffect, useState} from 'react';
import {LayoutChangeEvent, Pressable, StyleSheet} from 'react-native';
import {BottomTabBarProps} from '@react-navigation/bottom-tabs';
import type {AppTabsNavigatorParams} from '~/navigation/app.tabs.navigator';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {TABBAR_HEIGHT} from './constants';
import {useApplicationTheme} from '~/designSystem';

const OUTLINE_WIDTH = 64;

export const CustomTabBarItem = ({
  isFocused,
  navigation,
  routeName,
  routeKey,
  testID,
  icon,
}: {
  routeName: keyof AppTabsNavigatorParams;
  routeKey: string;
  navigation: BottomTabBarProps['navigation'];
  isFocused: boolean;
  testID: string;
  icon:
    | ((props: {
        focused: boolean;
        color: string;
        size: number;
      }) => React.ReactNode)
    | undefined;
}) => {
  const onPress = useCallback(() => {
    const event = navigation.emit({
      type: 'tabPress',
      target: routeKey,
      canPreventDefault: true,
    });

    if (!isFocused && !event.defaultPrevented) {
      navigation.navigate({
        key: routeKey,
        name: routeName,
        merge: true,
      });
    }
  }, [navigation, routeName, isFocused, routeKey]);
  const [width, setWidth] = useState(0);
  const focusTransition = useSharedValue(isFocused ? 1 : 0);

  useEffect(() => {
    focusTransition.value = withTiming(isFocused ? 1 : 0);
  }, [focusTransition, isFocused]);

  const onLayout = useCallback(
    (e: LayoutChangeEvent) => setWidth(e.nativeEvent.layout.width),
    [],
  );
  const theme = useApplicationTheme();

  const outlineAnimatedStyle = useAnimatedStyle(
    () => ({
      opacity: focusTransition.value,
      transform: [{scale: focusTransition.value}],
    }),
    [],
  );

  return (
    <Pressable
      onLayout={onLayout}
      testID={testID}
      onPress={onPress}
      style={[styles.itemWrapper]}>
      {!!width && (
        <Animated.View
          style={[
            styles.outline,
            {
              backgroundColor: theme.colors.secondaryContainer,
              left: (width - OUTLINE_WIDTH) / 2,
            },
            outlineAnimatedStyle,
          ]}
        />
      )}
      {!!icon &&
        icon({
          size: 24,
          color: theme.colors.onSecondaryContainer,
          focused: isFocused,
        })}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  itemWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  outline: {
    width: OUTLINE_WIDTH,
    height: OUTLINE_WIDTH / 2,
    borderRadius: OUTLINE_WIDTH / 4,
    position: 'absolute',
    top: (TABBAR_HEIGHT - OUTLINE_WIDTH / 2) / 2,
  },
});
