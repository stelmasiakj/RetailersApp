import {memo} from 'react';
import {useStylesheet} from '~/designSystem';
import {TransactionListItem} from '~/domain';
import {TRANSACTION_LIST_ITEM_HEIGHT} from '../constants';
import {View} from 'react-native';
import {Text} from 'react-native-paper';

export const TransactionListItemPresenter = memo(
  ({
    item: {amount, status, retailerFirstName, retailerLastName, createDate},
  }: {
    item: TransactionListItem;
  }) => {
    const styles = useStylesheet(
      () => ({
        container: {
          backgroundColor: 'red',
          height: TRANSACTION_LIST_ITEM_HEIGHT,
        },
      }),
      [],
    );

    return (
      <View style={styles.container}>
        <Text>
          {amount} {status} {retailerFirstName} {retailerLastName} {createDate}
        </Text>
      </View>
    );
  },
);
