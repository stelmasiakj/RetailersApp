import {memo, useCallback, useEffect, useMemo, useState} from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  View,
} from 'react-native';
import {useStylesheet} from '~/designSystem';
import {useRetailerId} from '../use.retailer.id';
import {useRetailerCreditCards} from '~/Retailer/hooks';
import {useAppDispatch} from '~/redux/use.app.dispatch';
import {EmptyView, ErrorView} from '~/components';
import {useTranslation} from 'react-i18next';
import React from 'react';
import {getRetailerCreditCardsThunk} from '~/Retailer/store';
import {CreditCardItem} from './credit.card.item';

export const RetailerCreditCardsTab = memo(() => {
  const styles = useStylesheet(
    ({colors, spacing}) => ({
      scroll: {
        flex: 1,
        backgroundColor: colors.background,
      },
      scrollContent: {
        paddingVertical: spacing[20],
      },
      centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      },
    }),
    [],
  );

  const retailerId = useRetailerId();
  const {cards, isError, isFetching} = useRetailerCreditCards(retailerId);
  const dispatch = useAppDispatch();
  const [t] = useTranslation();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchCards = useCallback(() => {
    return dispatch(getRetailerCreditCardsThunk({retailerId}));
  }, [dispatch, retailerId]);

  useEffect(() => {
    fetchCards();
  }, [fetchCards]);

  const onRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await fetchCards();
    setIsRefreshing(false);
  }, [fetchCards]);

  const refreshControl = useMemo(
    () => (
      <RefreshControl
        testID="RetailerCreditCardsTabActivityIndicator"
        refreshing={isRefreshing}
        onRefresh={onRefresh}
      />
    ),
    [onRefresh, isRefreshing],
  );

  return (
    <ScrollView
      testID="CreditCardsTab"
      refreshControl={refreshControl}
      style={styles.scroll}
      contentContainerStyle={styles.scrollContent}>
      {!cards && isFetching && (
        <View style={styles.centered}>
          <ActivityIndicator testID="RetailerCreditCardsTabActivityIndicator" />
        </View>
      )}
      {!cards && isError && <ErrorView />}
      {!!cards && !cards.length && <EmptyView title={t('noData')} />}
      {!!cards && !!cards.length && (
        <>
          {cards.map((card, index, arr) => (
            <CreditCardItem
              key={card.id}
              card={card}
              isLast={index === arr.length - 1}
            />
          ))}
        </>
      )}
    </ScrollView>
  );
});
