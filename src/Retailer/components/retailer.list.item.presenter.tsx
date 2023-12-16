import {memo, useCallback, useMemo} from 'react';
import {StyleSheet, View} from 'react-native';
import {RetailerListItem} from '~/domain';
import {RETAILER_LIST_ITEM_PRESENTER_HEIGHT} from '../constants';
import {Avatar, Text, TouchableRipple} from 'react-native-paper';
import {formatAddress} from '~/utils';
import {spacing} from '~/designSystem';

export const RetailerListItemPresenter = memo(
  ({
    item: {firstName, id, lastName, avatar, ...address},
    onPress,
  }: {
    item: RetailerListItem;
    onPress: (id: number) => void;
  }) => {
    const onPressed = useCallback(() => {
      onPress(id);
    }, [id, onPress]);

    const testID = useMemo(() => `RetailerListItem_${id}`, []);

    return (
      <TouchableRipple testID={testID} onPress={onPressed}>
        <View style={styles.itemContainer}>
          <Avatar.Image
            testID={`${testID}_Image`}
            source={{uri: avatar}}
            size={40}
          />
          <View>
            <Text variant="bodyMedium" numberOfLines={1}>
              {firstName} {lastName}
            </Text>
            <Text variant="bodySmall" numberOfLines={1}>
              {formatAddress(address)}
            </Text>
          </View>
        </View>
      </TouchableRipple>
    );
  },
);

const styles = StyleSheet.create({
  itemContainer: {
    height: RETAILER_LIST_ITEM_PRESENTER_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[16],
  },
});
