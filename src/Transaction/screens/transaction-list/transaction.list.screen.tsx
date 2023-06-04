import {useCallback, useEffect, useMemo, useState} from 'react';
import {View, useWindowDimensions} from 'react-native';
import {useApplicationTheme, useStylesheet} from '~/designSystem';
import {useTranslation} from 'react-i18next';
import {TabView} from 'react-native-tab-view';
import {AppHeader, AppTabBar} from '~/components';
import {TransactionList} from './transaction.list';
import {Appbar} from 'react-native-paper';
import {useTransactionsFilter} from '~/Transaction/hooks';
import {useNavigation} from '@react-navigation/native';
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {APP_HEADER_HEIGHT} from '~/components/AppHeader/app.header.constants';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

enum TransactionListTab {
  Active = 0,
  Finished,
}

export const TransactionListScreen = () => {
  const [t] = useTranslation();
  const [tab, setTab] = useState(TransactionListTab.Active);
  const filter = useTransactionsFilter();
  const {top} = useSafeAreaInsets();
  const styles = useStylesheet(
    ({colors}) => ({
      container: {
        flex: 1,
        backgroundColor: colors.background,
      },
      header: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
      },
      topStabilizer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: top,
      },
    }),
    [top],
  );
  const hasFilter =
    !!filter.maxStart || !!filter.minStart || !!filter.retailerIds?.length;

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

  const navigation = useNavigation();
  const navigateToFilter = useCallback(() => {
    navigation.navigate('TransactionFilter');
  }, [navigation]);

  const headerRight = useMemo(
    () => (
      <Appbar.Action
        icon={hasFilter ? 'filter' : 'filter-outline'}
        onPress={navigateToFilter}
      />
    ),
    [hasFilter, navigateToFilter],
  );

  const headerTranslateY = useSharedValue(0);

  useEffect(() => {
    headerTranslateY.value = withTiming(0);
  }, [tab, headerTranslateY]);

  const renderScene: React.ComponentProps<typeof TabView>['renderScene'] =
    useCallback(
      ({route}) => {
        const sceneTab: TransactionListTab = parseInt(route.key, 10);
        switch (sceneTab) {
          case TransactionListTab.Active:
            return (
              <TransactionList
                type="ACTIVE"
                headerTranslateY={headerTranslateY}
              />
            );
          case TransactionListTab.Finished:
            return (
              <TransactionList
                type="FINISHED"
                headerTranslateY={headerTranslateY}
              />
            );
        }
      },
      [headerTranslateY],
    );

  const headerContentAnimatedStyle = useAnimatedStyle(
    () => ({
      transform: [{translateY: headerTranslateY.value}],
    }),
    [],
  );

  const {
    colors: {
      surface,
      elevation: {level2},
    },
  } = useApplicationTheme();
  const topStabilizerAnimatedStyle = useAnimatedStyle(
    () => ({
      backgroundColor: interpolateColor(
        headerTranslateY.value,
        [-APP_HEADER_HEIGHT, 0],
        [surface, level2],
      ),
    }),
    [surface, level2],
  );

  const renderTabBar: NonNullable<
    React.ComponentProps<typeof TabView>['renderTabBar']
  > = useCallback(
    props => {
      return (
        <View style={styles.header}>
          <Animated.View style={headerContentAnimatedStyle}>
            <AppHeader title={t('transactions.title')} right={headerRight} />

            <AppTabBar {...props} />
          </Animated.View>
          <Animated.View
            style={[styles.topStabilizer, topStabilizerAnimatedStyle]}
          />
        </View>
      );
    },
    [
      headerRight,
      styles,
      headerContentAnimatedStyle,
      topStabilizerAnimatedStyle,
      t,
    ],
  );

  return (
    <>
      <View style={styles.container}>
        <TabView
          navigationState={navigationState}
          onIndexChange={setTab}
          renderScene={renderScene}
          initialLayout={initialLayout}
          renderTabBar={renderTabBar}
          tabBarPosition="bottom"
        />
      </View>
    </>
  );
};
