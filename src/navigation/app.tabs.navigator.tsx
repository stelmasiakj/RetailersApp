import {
  BottomTabBarProps,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import {CommonActions, NavigatorScreenParams} from '@react-navigation/native';
import {
  RetailerStackNavigator,
  RetailerStackNavigatorParams,
} from './retailer.stack.navigator';
import {TransactionListScreen} from '~/Transaction';
import {ProfileScreen} from '~/User';
import {BottomNavigation} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {spacing} from '~/designSystem';

export type AppTabsNavigatorParams = {
  Retailer: NavigatorScreenParams<RetailerStackNavigatorParams>;
  Transactions: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<AppTabsNavigatorParams>();

const renderTabBar = ({
  navigation,
  state,
  descriptors,
  insets,
}: BottomTabBarProps) => {
  return (
    <BottomNavigation.Bar
      labeled={false}
      navigationState={state}
      safeAreaInsets={{...insets, bottom: insets.bottom > 0 ? spacing[20] : 0}}
      onTabPress={({route, preventDefault}) => {
        const event = navigation.emit({
          type: 'tabPress',
          target: route.key,
          canPreventDefault: true,
        });

        if (event.defaultPrevented) {
          preventDefault();
        } else {
          navigation.dispatch({
            ...CommonActions.navigate(route.name, route.params),
            target: state.key,
          });
        }
      }}
      renderIcon={({route, focused, color}) => {
        const {options} = descriptors[route.key];
        if (options.tabBarIcon) {
          return options.tabBarIcon({focused, color, size: 24});
        }

        return null;
      }}
      getLabelText={({route}) => {
        const {options} = descriptors[route.key];
        const label = options.title || route.name;

        return label;
      }}
      renderLabel={() => null}
    />
  );
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
    <Tab.Navigator initialRouteName="Retailer" tabBar={renderTabBar}>
      <Tab.Screen
        name="Retailer"
        component={RetailerStackNavigator}
        options={{
          headerShown: false,
          tabBarIcon: RetailersIcon,
        }}
      />
      <Tab.Screen
        name="Transactions"
        component={TransactionListScreen}
        options={{
          headerShown: false,
          tabBarIcon: TransactionsIcon,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          headerShown: false,
          tabBarIcon: ProfileIcon,
        }}
      />
    </Tab.Navigator>
  );
};
