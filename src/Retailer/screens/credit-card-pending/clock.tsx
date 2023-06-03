import {memo, useEffect} from 'react';
import Animated, {
  Easing,
  interpolate,
  useAnimatedProps,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import Svg, {Path, G} from 'react-native-svg';
import {useApplicationTheme} from '~/designSystem';

const AnimatedPath = Animated.createAnimatedComponent(Path);

const DURATION = 60 * 1000;

export const Clock = memo(() => {
  const animation = useSharedValue(0);

  useEffect(() => {
    animation.value = withRepeat(
      withTiming(1, {duration: DURATION, easing: Easing.linear}),
      -1,
    );
  }, [animation]);

  const animatedProps = useAnimatedProps(() => {
    const length = 120;
    const arc = Math.round(interpolate(animation.value, [0, 1], [0, 360]));
    const trueArc = arc - (arc % 6);

    const finalX = 244 + Math.sin((trueArc / 360) * 2 * Math.PI) * length;
    const finalY = 244 - Math.cos((trueArc / 360) * 2 * Math.PI) * length;

    return {
      d: `M244,244L${finalX},${finalY}`,
    };
  });

  const theme = useApplicationTheme();
  const color = theme.colors.onBackground;

  return (
    <Svg fill={color} height="100%" width="100%" viewBox="0 0 488 488">
      <Path
        d="M244,244v-80"
        strokeWidth="20"
        strokeLinecap="round"
        stroke={color}
      />
      <AnimatedPath
        animatedProps={animatedProps}
        strokeWidth="20"
        strokeLinecap="round"
        strokeLinejoin="miter"
        stroke={color}
      />
      <G transform="translate(0 -540.36)">
        <G>
          <G>
            <Path
              d="M416.4,611.96L416.4,611.96c-46.2-46.2-107.4-71.6-172.4-71.6s-126.2,25.4-172.4,71.6C25.4,658.16,0,719.36,0,784.36
				s25.4,126.2,71.6,172.4c46.2,46.2,107.4,71.6,172.4,71.6s126.2-25.4,172.4-71.6s71.6-107.4,71.6-172.4S462.6,658.16,416.4,611.96
				z M254,1008.16L254,1008.16v-40.8c0-5.5-4.5-10-10-10s-10,4.5-10,10v40.8c-115.6-5.1-208.7-98.2-213.8-213.8H61
				c5.5,0,10-4.5,10-10s-4.5-10-10-10H20.2c5.1-115.6,98.2-208.7,213.8-213.8v40.8c0,5.5,4.5,10,10,10s10-4.5,10-10v-40.8
				c115.6,5.1,208.7,98.2,213.8,213.8H427c-5.5,0-10,4.5-10,10s4.5,10,10,10h40.8C462.7,909.96,369.6,1003.06,254,1008.16z"
            />
          </G>
        </G>
      </G>
    </Svg>
  );
});
