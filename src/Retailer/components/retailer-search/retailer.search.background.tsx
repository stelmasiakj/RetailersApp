import {memo} from 'react';
import {StyleProp, ViewStyle, useWindowDimensions} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {
  RETAILER_SEARCH_BAR_HEIGHT,
  RETAILER_SEARCH_BAR_MARGIN,
} from './constants';
import {useStylesheet} from '~/designSystem';
import Animated, {interpolate, useAnimatedStyle} from 'react-native-reanimated';

export const RetailerSearchBackground = memo(
  ({
    openTransition,
    style,
  }: {
    openTransition: Animated.SharedValue<number>;
    style: StyleProp<ViewStyle>;
  }) => {
    const {width: screenWidth, height: screenHeight} = useWindowDimensions();
    const {top} = useSafeAreaInsets();

    const leftAnimatedStyle = useAnimatedStyle(() => {
      const scaleX = openTransition.value;
      const translateX = interpolate(
        openTransition.value,
        [0, 1],
        [RETAILER_SEARCH_BAR_MARGIN / 2, 0],
      );

      return {
        transform: [{translateX}, {scaleX}],
      };
    }, []);

    const rigthAnimatedStyle = useAnimatedStyle(() => {
      const scaleX = openTransition.value;
      const translateX = interpolate(
        openTransition.value,
        [0, 1],
        [-RETAILER_SEARCH_BAR_MARGIN / 2, 0],
      );

      return {
        transform: [{translateX}, {scaleX}],
      };
    }, []);

    const topBackgroundHeight = top + RETAILER_SEARCH_BAR_MARGIN;
    const bottomBackgroundHeight =
      screenHeight -
      top -
      RETAILER_SEARCH_BAR_MARGIN -
      RETAILER_SEARCH_BAR_HEIGHT;

    const triggerWidth = screenWidth - 2 * RETAILER_SEARCH_BAR_MARGIN;

    const topAnimatedStyle = useAnimatedStyle(() => {
      const scaleY = openTransition.value;
      const translateY = interpolate(
        openTransition.value,
        [0, 1],
        [topBackgroundHeight / 2, 0],
      );
      const scaleX = interpolate(
        openTransition.value,
        [0, 1],
        [triggerWidth / screenWidth, 1],
      );

      return {
        transform: [{translateY}, {scaleY}, {scaleX}],
      };
    }, [topBackgroundHeight, triggerWidth, screenWidth]);

    const bottomAnimatedStyle = useAnimatedStyle(() => {
      const scaleY = openTransition.value;
      const translateY = interpolate(
        openTransition.value,
        [0, 1],
        [-bottomBackgroundHeight / 2, 0],
      );
      const scaleX = interpolate(
        openTransition.value,
        [0, 1],
        [triggerWidth / screenWidth, 1],
      );

      return {
        transform: [{translateY}, {scaleY}, {scaleX}],
      };
    }, [bottomBackgroundHeight, triggerWidth, screenWidth]);

    const styles = useStylesheet(
      () => ({
        left: {
          position: 'absolute',
          top: top + RETAILER_SEARCH_BAR_MARGIN,
          left: 0,
          width: RETAILER_SEARCH_BAR_MARGIN,
          height: RETAILER_SEARCH_BAR_HEIGHT,
        },
        right: {
          position: 'absolute',
          top: top + RETAILER_SEARCH_BAR_MARGIN,
          right: 0,
          width: RETAILER_SEARCH_BAR_MARGIN,
          height: RETAILER_SEARCH_BAR_HEIGHT,
        },
        top: {
          position: 'absolute',
          top: 0,
          right: 0,
          left: 0,
          height: topBackgroundHeight,
        },
        bottom: {
          position: 'absolute',
          top: top + RETAILER_SEARCH_BAR_MARGIN + RETAILER_SEARCH_BAR_HEIGHT,
          right: 0,
          left: 0,
          bottom: 0,
        },
      }),
      [top, topBackgroundHeight],
    );

    return (
      <>
        <Animated.View style={[styles.left, leftAnimatedStyle, style]} />
        <Animated.View style={[styles.right, rigthAnimatedStyle, style]} />
        <Animated.View style={[styles.top, topAnimatedStyle, style]} />
        <Animated.View style={[styles.bottom, bottomAnimatedStyle, style]} />
      </>
    );
  },
);
