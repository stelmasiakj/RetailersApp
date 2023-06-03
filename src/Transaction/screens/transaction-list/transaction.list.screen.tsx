import {useCallback, useMemo, useState} from 'react';
import {View, useWindowDimensions} from 'react-native';
import {useStylesheet} from '~/designSystem';
import {useTranslation} from 'react-i18next';
import {TabView} from 'react-native-tab-view';
import {AppHeader, AppTabBar} from '~/components';
import {TransactionList} from './transaction.list';
import {Appbar} from 'react-native-paper';
import {useTransactionsFilter} from '~/Transaction/hooks';
import {useNavigation} from '@react-navigation/native';

enum TransactionListTab {
  Active = 0,
  Finished,
}

export const TransactionListScreen = () => {
  const [t] = useTranslation();
  const [tab, setTab] = useState(TransactionListTab.Active);
  const filter = useTransactionsFilter();

  const styles = useStylesheet(
    ({colors}) => ({
      container: {
        flex: 1,
        backgroundColor: colors.background,
      },
    }),
    [],
  );

  const {width: screenWidth} = useWindowDimensions();
  const initialLayout = useMemo(() => ({width: screenWidth}), [screenWidth]);

  const navigationState = useMemo<
    React.ComponentProps<typeof TabView>['navigationState']
  >(
    () => ({
      index: tab,
      routes: [
        {
          key: TransactionListTab.Active.toString(),
          title: t('transactions.active'),
        },
        {
          key: TransactionListTab.Finished.toString(),
          title: t('transactions.finished'),
        },
      ],
    }),
    [tab, t],
  );

  const renderScene: React.ComponentProps<typeof TabView>['renderScene'] =
    useCallback(({route}) => {
      const sceneTab: TransactionListTab = parseInt(route.key, 10);
      switch (sceneTab) {
        case TransactionListTab.Active:
          return <TransactionList type="ACTIVE" />;
        case TransactionListTab.Finished:
          return <TransactionList type="FINISHED" />;
      }
    }, []);

  const renderTabBar: NonNullable<
    React.ComponentProps<typeof TabView>['renderTabBar']
  > = useCallback(props => {
    return <AppTabBar {...props} />;
  }, []);

  const navigation = useNavigation();
  const navigateToFilter = useCallback(() => {
    navigation.navigate('TransactionFilter');
  }, [navigation]);

  return (
    <>
      <AppHeader
        title={t('transactions.title')}
        right={
          <Appbar.Action
            icon={filter ? 'filter' : 'filter-outline'}
            onPress={navigateToFilter}
          />
        }
      />

      <View style={styles.container}>
        <TabView
          navigationState={navigationState}
          onIndexChange={setTab}
          renderScene={renderScene}
          initialLayout={initialLayout}
          renderTabBar={renderTabBar}
        />
      </View>
    </>
  );
};
