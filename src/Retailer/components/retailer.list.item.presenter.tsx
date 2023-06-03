import {useNavigation} from '@react-navigation/native';
import {memo, useCallback} from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import {RetailerListItem} from '~/domain';
import {RETAILER_LIST_ITEM_PRESENTER_HEIGHT} from '../constants';
import {Avatar, Text} from 'react-native-paper';
import {formatAddress} from '~/utils';
import {spacing} from '~/designSystem';

export const RetailerListItemPresenter = memo(
  ({
    item: {firstName, id, lastName, avatar, ...address},
  }: {
    item: RetailerListItem;
  }) => {
    const navigation = useNavigation();
    const navigateToRetailerDetails = useCallback(() => {
      navigation.navigate('AppTabs', {
        screen: 'Retailer',
        params: {screen: 'RetailerDetails', params: {id}},
      });
    }, [navigation, id]);

    return (
      <Pressable
        onPress={navigateToRetailerDetails}
        style={styles.itemContainer}>
        <Avatar.Image source={{uri: avatar}} size={40} />
        <View>
          <Text variant="bodyMedium" numberOfLines={1}>
            {firstName} {lastName}
          </Text>
          <Text variant="bodySmall" numberOfLines={1}>
            {formatAddress(address)}
          </Text>
        </View>
      </Pressable>
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
