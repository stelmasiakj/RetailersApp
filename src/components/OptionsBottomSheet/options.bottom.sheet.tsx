import {memo} from 'react';
import {BottomSheet} from '../BottomSheet';
import {IOption} from './ioption';
import {Portal} from '@gorhom/portal';
import {spacing, useStylesheet} from '~/designSystem';
import {StyleSheet, View} from 'react-native';
import React from 'react';

import {OPTION_ITEM_HEIGHT, OptionItem} from './option.item';
import {Divider} from 'react-native-paper';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

export const OptionsBottomSheet = memo(
  ({
    isVisible,
    onClose,
    options,
    onOptionPress,
  }: {
    isVisible: boolean;
    onClose: () => void;
    options: Array<IOption>;
    onOptionPress: (id: string) => void;
  }) => {
    const {bottom} = useSafeAreaInsets();

    const styles = useStylesheet(
      () => ({
        content: {
          padding: spacing[20],
          paddingBottom: spacing[20] + bottom,
        },
      }),
      [bottom],
    );

    return (
      <Portal>
        <BottomSheet
          isVisible={isVisible}
          onClose={onClose}
          height={
            OPTION_ITEM_HEIGHT * options.length +
            2 * spacing[20] +
            bottom +
            (options.length - 1) * StyleSheet.hairlineWidth
          }>
          <View style={styles.content}>
            {options.map((item, index, arr) => (
              <React.Fragment key={item.id}>
                <OptionItem item={item} onPress={onOptionPress} />
                {index < arr.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </View>
        </BottomSheet>
      </Portal>
    );
  },
);
