import {memo} from 'react';
import {View} from 'react-native';
import {useStylesheet} from '~/designSystem';

export const BottomSheetHandle = memo(() => {
  const styles = useStylesheet(
    ({colors, spacing}) => ({
      header: {
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        paddingHorizontal: spacing[8],
        height: 20,
      },
      handle: {
        height: 6,
        borderRadius: 3,
        width: 100,
        backgroundColor: colors.elevation.level2,
      },
    }),
    [],
  );

  return (
    <View style={styles.header}>
      <View style={styles.handle} />
    </View>
  );
});
