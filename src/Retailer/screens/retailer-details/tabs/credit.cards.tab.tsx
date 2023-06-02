import {memo, useCallback, useEffect, useMemo, useState} from 'react';
import {RefreshControl, ScrollView, View} from 'react-native';
import {useStylesheet} from '~/designSystem';
import {useRetailerId} from '../use.retailer.id';
import {useRetailerCreditCards} from '~/Retailer/hooks.ts';
import {useAppDispatch} from '~/redux/use.app.dispatch';
import {EmptyView, ErrorView} from '~/components';
import {ActivityIndicator, List, Divider} from 'react-native-paper';
import {useTranslation} from 'react-i18next';
import React from 'react';
import {CreditCardListItem} from '~/domain';
import {getRetailerCreditCardsThunk} from '~/Retailer/store';

const CardItem = memo(
  ({card, isLast}: {card: CreditCardListItem; isLast: boolean}) => {
    const left: NonNullable<React.ComponentProps<typeof List.Item>['left']> =
      useCallback(
        props => <List.Icon {...props} icon="credit-card-outline" />,
        [],
      );

    return <List.Item left={left} title="fdfdf" description={card.expires} />;
  },
);

export const CreditCardsTab = memo(() => {
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
    () => <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />,
    [onRefresh, isRefreshing],
  );

  return (
    <ScrollView
      refreshControl={refreshControl}
      style={styles.scroll}
      contentContainerStyle={styles.scrollContent}>
      {!cards && isFetching && (
        <View style={styles.centered}>
          <ActivityIndicator />
        </View>
      )}
      {!cards && isError && <ErrorView />}
      {!!cards && !cards.length && <EmptyView title={t('noData')} />}
      {!!cards && !!cards.length && (
        <>
          {cards.map((card, index, arr) => (
            <CardItem
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
