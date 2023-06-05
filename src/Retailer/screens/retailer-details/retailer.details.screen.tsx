import {useState, useMemo, useCallback, useEffect} from 'react';
import {useTranslation} from 'react-i18next';
import {View, useWindowDimensions} from 'react-native';
import {TabView} from 'react-native-tab-view';
import {AppTabBar} from '~/components';
import {useStylesheet} from '~/designSystem';
import {CreditCardsTab, InfoTab, TransactionsTab} from './tabs';
import {useCustomTabbarHeight} from '~/navigationElements';
import {useNavigation} from '@react-navigation/native';
import {Appbar} from 'react-native-paper';
import {useRetailerId} from './use.retailer.id';

enum RetailerDetailsTab {
  Info = 0,
  CreditCards,
  Transactions,
}

export const RetailerDetailsScreen = () => {
  const [t] = useTranslation();
  const [tab, setTab] = useState(RetailerDetailsTab.Info);
  const retailerId = useRetailerId();
  const {width: screenWidth} = useWindowDimensions();
  const initialLayout = useMemo(() => ({width: screenWidth}), [screenWidth]);
  const navigation = useNavigation();

  const navigateToAddCreditCard = useCallback(() => {
    navigation.navigate('AddCreditCard', {retailerId});
  }, [navigation, retailerId]);

  const AddCreditCardButton = useCallback(
    () => <Appbar.Action icon="plus" onPress={navigateToAddCreditCard} />,
    [navigateToAddCreditCard],
  );

  useEffect(() => {
    if (tab === RetailerDetailsTab.CreditCards) {
      navigation.setOptions({
        headerRight: AddCreditCardButton,
      });
    } else {
      navigation.setOptions({
        headerRight: () => null,
      });
    }
  }, [navigation, tab, AddCreditCardButton]);

  const navigationState = useMemo<
    React.ComponentProps<typeof TabView>['navigationState']
  >(
    () => ({
      index: tab,
      routes: [
        {
          key: RetailerDetailsTab.Info.toString(),
          title: t('retailer.info'),
        },

        {
          key: RetailerDetailsTab.CreditCards.toString(),
          title: t('retailer.creditCards'),
        },
        {
          key: RetailerDetailsTab.Transactions.toString(),
          title: t('retailer.transactions'),
        },
      ],
    }),
    [tab, t],
  );

  const tabbarHeight = useCustomTabbarHeight();
  const styles = useStylesheet(
    ({colors}) => ({
      container: {
        flex: 1,
        backgroundColor: colors.background,
        paddingBottom: tabbarHeight,
      },
    }),
    [tabbarHeight],
  );

  const renderScene: React.ComponentProps<typeof TabView>['renderScene'] =
    useCallback(({route}) => {
      const sceneTab: RetailerDetailsTab = parseInt(route.key, 10);
      switch (sceneTab) {
        case RetailerDetailsTab.Info:
          return <InfoTab />;
        case RetailerDetailsTab.CreditCards:
          return <CreditCardsTab />;
        case RetailerDetailsTab.Transactions:
          return <TransactionsTab />;
      }
    }, []);

  const renderTabBar: NonNullable<
    React.ComponentProps<typeof TabView>['renderTabBar']
  > = useCallback(props => {
    return <AppTabBar {...props} scrollEnabled />;
  }, []);

  return (
    <View style={styles.container} testID="RetailerDetailsScreen">
      <TabView
        navigationState={navigationState}
        onIndexChange={setTab}
        renderScene={renderScene}
        initialLayout={initialLayout}
        renderTabBar={renderTabBar}
      />
    </View>
  );
};
