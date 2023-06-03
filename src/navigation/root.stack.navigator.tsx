import {NavigatorScreenParams} from '@react-navigation/native';
import {StackHeaderProps, createStackNavigator} from '@react-navigation/stack';
import {AppTabsNavigator, AppTabsNavigatorParams} from './app.tabs.navigator';
import {LoginScreen} from '~/Auth';
import {EditProfileScreen} from '~/User';
import {AddCreditCardScreen} from '~/Retailer';
import {CreditCardPendingScreen} from '~/Retailer/screens/credit-card-pending';
import {TransactionFilterScreen} from '~/Transaction';
import {useTranslation} from 'react-i18next';
import {CustomNavigationHeader} from '~/navigationElements';

export type RootStackNavigatorParams = {
  Login: undefined;
  EditProfile: undefined;
  AppTabs: NavigatorScreenParams<AppTabsNavigatorParams>;
  AddCreditCard: {retailerId: number};
  CreditCardPending: {
    retailerId: number;
    cardNumber: string;
    cv2: string;
    expiration: string;
  };
  TransactionFilter: undefined;
};

const Stack = createStackNavigator<RootStackNavigatorParams>();

const renderCustomHeader = (props: StackHeaderProps) => (
  <CustomNavigationHeader {...props} />
);

export const RootStackNavigator = ({
  initialRouteName,
}: {
  initialRouteName: keyof RootStackNavigatorParams;
}) => {
  const [t] = useTranslation();
  return (
    <Stack.Navigator
      initialRouteName={initialRouteName}
      screenOptions={{
        headerBackTitleVisible: false,
        header: renderCustomHeader,
      }}>
      <Stack.Screen
        name="AppTabs"
        component={AppTabsNavigator}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="AddCreditCard"
        component={AddCreditCardScreen}
        options={{title: t('creditCard.addTitle')}}
      />
      <Stack.Screen
        name="CreditCardPending"
        component={CreditCardPendingScreen}
        options={{headerShown: false, gestureEnabled: false}}
      />
      <Stack.Group screenOptions={{presentation: 'modal', headerShown: false}}>
        <Stack.Screen name="EditProfile" component={EditProfileScreen} />
        <Stack.Screen
          name="TransactionFilter"
          component={TransactionFilterScreen}
        />
      </Stack.Group>
    </Stack.Navigator>
  );
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackNavigatorParams {}
  }
}
