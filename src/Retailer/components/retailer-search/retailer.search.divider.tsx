import {memo} from 'react';
import {Divider} from 'react-native-paper';
import Animated, {useAnimatedStyle} from 'react-native-reanimated';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useStylesheet} from '~/designSystem';
import {
  RETAILER_SEARCH_BAR_HEIGHT,
  RETAILER_SEARCH_BAR_MARGIN,
} from './constants';

export const RetailerSearchDivider = memo(
  ({openTransition}: {openTransition: Animated.SharedValue<number>}) => {
    const dividerAnimatedStyle = useAnimatedStyle(
      () => ({
        opacity: openTransition.value,
      }),
      [],
    );

    const {top} = useSafeAreaInsets();
    const styles = useStylesheet(
      () => ({
        divider: {
          position: 'absolute',
          left: 0,
          right: 0,
          top: top + RETAILER_SEARCH_BAR_MARGIN + RETAILER_SEARCH_BAR_HEIGHT,
        },
      }),
      [top],
    );

    return (
      <Animated.View style={[styles.divider, dividerAnimatedStyle]}>
        <Divider />
      </Animated.View>
    );
  },
);
