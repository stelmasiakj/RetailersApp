import {useNavigation} from '@react-navigation/native';
import {memo, useCallback} from 'react';
import {Pressable} from 'react-native';
import {Text} from 'react-native-paper';
import {RetailerListItem} from '~/domain';
import {RETAILER_LIST_ITEM_PRESENTER_HEIGHT} from '../constants';

export const RetailerListItemPresenter = memo(
  ({item: {firstName, id, lastName}}: {item: RetailerListItem}) => {
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
        style={{
          height: RETAILER_LIST_ITEM_PRESENTER_HEIGHT,
          backgroundColor: 'red',
          justifyContent: 'center',
        }}>
        <Text variant="bodyMedium">
          {firstName} {lastName}
        </Text>
      </Pressable>
    );
  },
);
