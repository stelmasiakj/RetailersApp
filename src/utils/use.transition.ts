import {useEffect} from 'react';
import {useSharedValue, withTiming} from 'react-native-reanimated';

type TTimingConfig = Parameters<typeof withTiming>[1];

export const useTransition = (
  value: boolean,
  timingConfig: TTimingConfig = undefined,
) => {
  const sharedValue = useSharedValue(value ? 1 : 0);

  useEffect(() => {
    sharedValue.value = withTiming(value ? 1 : 0, timingConfig);
  }, [value, sharedValue, timingConfig]);

  return sharedValue;
};
