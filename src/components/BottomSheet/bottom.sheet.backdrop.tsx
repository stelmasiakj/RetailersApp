import {BottomSheetBackdropProps} from '@gorhom/bottom-sheet';
import {memo, useMemo} from 'react';
import {
  StyleProp,
  ViewStyle,
  ViewProps,
  Pressable,
  StyleSheet,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  interpolate,
  useAnimatedProps,
} from 'react-native-reanimated';

export const BottomSheetBackdrop = memo(
  ({
    style,
    animatedIndex,
    onPress,
  }: BottomSheetBackdropProps & {onPress: () => void}) => {
    const animatedStyle = useAnimatedStyle(() => {
      return {
        opacity: interpolate(animatedIndex.value, [-1, 0], [0, 0.7]),
      };
    }, []);

    const containerStyle = useMemo<StyleProp<ViewStyle>>(
      () => [style, animatedStyle, {backgroundColor: '#000'}],
      [animatedStyle, style],
    );

    const animatedProps = useAnimatedProps<ViewProps>(() => {
      return {
        pointerEvents: animatedIndex.value >= 0 ? 'auto' : 'none',
      };
    }, []);

    return (
      <Animated.View style={containerStyle} animatedProps={animatedProps}>
        <Pressable style={StyleSheet.absoluteFillObject} onPress={onPress} />
      </Animated.View>
    );
  },
);
