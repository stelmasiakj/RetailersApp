import React, {memo, useCallback, useEffect, useMemo, useState} from 'react';
import {ActivityIndicator, ScrollView, View} from 'react-native';
import {useRetailerId} from '../use.retailer.id';
import {useAppDispatch} from '~/redux/use.app.dispatch';
import {useRetailerDetails} from '~/Retailer/hooks';
import {getRetailerDetailsThunk} from '~/Retailer/store';
import {spacing, useStylesheet} from '~/designSystem';
import {Card, List} from 'react-native-paper';
import {ErrorView} from '~/components';
import {useTranslation} from 'react-i18next';
import {formatAddress, formatDate, formatPhoneNumber} from '~/utils';
import {RefreshControl} from 'react-native-gesture-handler';

const Info = memo(
  ({icon, title, value}: {title: string; value: string; icon: string}) => {
    const left: NonNullable<React.ComponentProps<typeof List.Item>['left']> =
      useCallback(props => <List.Icon {...props} icon={icon} />, [icon]);

    return <List.Item left={left} title={title} description={value} />;
  },
);

export const RetailerInfoTab = memo(() => {
  const id = useRetailerId();
  const {details, isError, isFetching} = useRetailerDetails(id);
  const dispatch = useAppDispatch();
  const [t] = useTranslation();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchInfo = useCallback(() => {
    return dispatch(getRetailerDetailsThunk({id}));
  }, [dispatch, id]);

  useEffect(() => {
    fetchInfo();
  }, [fetchInfo]);

  const styles = useStylesheet(
    ({colors}) => ({
      container: {
        flex: 1,
        backgroundColor: colors.background,
      },
      centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      },

      scroll: {
        flex: 1,
      },
      scrollContent: {
        padding: spacing[20],
      },
    }),
    [],
  );

  const onRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await fetchInfo();
    setIsRefreshing(false);
  }, [fetchInfo]);

  const refreshControl = useMemo(
    () => <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />,
    [onRefresh, isRefreshing],
  );

  return (
    <View style={styles.container}>
      {!details && isFetching && (
        <View style={styles.centered}>
          <ActivityIndicator />
        </View>
      )}
      {!details && isError && <ErrorView />}
      {!!details && (
        <ScrollView
          refreshControl={refreshControl}
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}>
          <Card mode="elevated">
            <Card.Cover source={{uri: details.avatar}} />
            <Card.Title
              title={`${details.firstName} ${details.lastName}`}
              titleVariant="headlineMedium"
              subtitleVariant="bodyLarge"
            />
            <Card.Content>
              <Info
                title={t('retailer.email')}
                value={details.email}
                icon="email"
              />
              <Info
                title={t('retailer.address')}
                value={formatAddress(details)}
                icon="home"
              />

              <Info
                title={t('retailer.phone')}
                value={formatPhoneNumber(details.phoneNumber)}
                icon="cellphone"
              />
              <Info
                title={t('retailer.joinDate')}
                value={formatDate(details.joinDate)}
                icon="account-arrow-up"
              />
            </Card.Content>
          </Card>
        </ScrollView>
      )}
    </View>
  );
});
