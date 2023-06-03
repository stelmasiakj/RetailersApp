import {memo, useMemo} from 'react';
import {spacing, useStylesheet} from '~/designSystem';
import {TransactionListItem} from '~/domain';
import {TRANSACTION_LIST_ITEM_HEIGHT} from '../constants';
import {View} from 'react-native';
import {Chip, Surface, Text} from 'react-native-paper';
import Animated, {FadeIn} from 'react-native-reanimated';
import {useTranslation} from 'react-i18next';
import {formatDatetime} from '~/utils';

export const TransactionListItemPresenter = memo(
  ({
    item: {amount, status, retailerFirstName, retailerLastName, createDate},
  }: {
    item: TransactionListItem;
  }) => {
    const [t] = useTranslation();
    const styles = useStylesheet(
      ({colors}) => ({
        container: {
          height: TRANSACTION_LIST_ITEM_HEIGHT,
          padding: spacing[16],
          justifyContent: 'space-between',
        },
        row: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        },
        chip: {
          width: 90,
          backgroundColor:
            status === 'PENDING'
              ? colors.primaryContainer
              : status === 'FINISHED'
              ? colors.secondaryContainer
              : colors.error,
        },
        chipText: {
          color:
            status === 'PENDING'
              ? colors.onPrimaryContainer
              : status === 'FINISHED'
              ? colors.onSecondaryContainer
              : colors.onError,
        },
      }),
      [status],
    );

    const statusText = useMemo(() => {
      switch (status) {
        case 'FINISHED':
          return t('transactions.finished');
        case 'PENDING':
          return t('transactions.pending');
        case 'REJECTED':
          return t('transactions.rejected');
      }
    }, [status, t]);

    return (
      <Animated.View entering={FadeIn}>
        <Surface mode="elevated" style={styles.container}>
          {/* <Text>
          {amount} {status} {retailerFirstName} {retailerLastName} {createDate}
        </Text> */}
          <View style={styles.row}>
            <Text variant="bodyMedium">
              {retailerFirstName} {retailerLastName}
            </Text>
            <Text variant="bodySmall">{amount} USD</Text>
          </View>
          <View style={styles.row}>
            <Text variant="bodySmall">{formatDatetime(createDate)}</Text>
            <Chip style={styles.chip} textStyle={styles.chipText} elevated>
              {statusText}
            </Chip>
          </View>
        </Surface>
      </Animated.View>
    );
  },
);
