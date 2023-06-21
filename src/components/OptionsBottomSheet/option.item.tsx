import {memo, useCallback} from 'react';
import {StyleSheet, View} from 'react-native';
import {Text, TouchableRipple} from 'react-native-paper';
import {IOption} from './ioption';
import {spacing, useApplicationTheme} from '~/designSystem';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export const OPTION_ITEM_HEIGHT = 55;

export const OptionItem = memo(
  ({
    item: {icon, label, id},
    onPress,
  }: {
    item: IOption;
    onPress: (id: string) => void;
  }) => {
    const onPressCore = useCallback(() => {
      onPress(id);
    }, [id, onPress]);
    const theme = useApplicationTheme();

    return (
      <TouchableRipple onPress={onPressCore}>
        <View style={styles.container}>
          <Icon name={icon} color={theme.colors.onBackground} size={24} />
          <Text variant="bodyMedium">{label}</Text>
        </View>
      </TouchableRipple>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    height: OPTION_ITEM_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[32],
    paddingHorizontal: spacing[8],
  },
});
