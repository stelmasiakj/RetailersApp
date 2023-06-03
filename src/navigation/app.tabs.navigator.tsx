import {
  BottomTabBarProps,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import {NavigatorScreenParams} from '@react-navigation/native';
import {
  RetailerStackNavigator,
  RetailerStackNavigatorParams,
} from './retailer.stack.navigator';
import {TransactionListScreen} from '~/Transaction';
import {ProfileScreen} from '~/User';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {CustomTabBar} from '~/navigationElements';

export type AppTabsNavigatorParams = {
  Retailer: NavigatorScreenParams<RetailerStackNavigatorParams>;
  Transactions: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<AppTabsNavigatorParams>();

const renderTabBar = (props: BottomTabBarProps) => {
  return <CustomTabBar {...props} />;
};

const CreateTabBarIconComponent =
  (icon: string) =>
  ({color, size}: {color: string; size: number}) => {
    return <Icon name={icon} size={size} color={color} />;
  };

const RetailersIcon = CreateTabBarIconComponent('basket');
const TransactionsIcon = CreateTabBarIconComponent('cash');
const ProfileIcon = CreateTabBarIconComponent('account');

export const AppTabsNavigator = () => {
  return (
    <Tab.Navigator
      initialRouteName="Retailer"
      tabBar={renderTabBar}
      screenOptions={{headerShown: false}}>
      <Tab.Screen
        name="Retailer"
        component={RetailerStackNavigator}
        options={{
          tabBarIcon: RetailersIcon,
        }}
      />
      <Tab.Screen
        name="Transactions"
        component={TransactionListScreen}
        options={{
          tabBarIcon: TransactionsIcon,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ProfileIcon,
        }}
      />
    </Tab.Navigator>
  );
};
