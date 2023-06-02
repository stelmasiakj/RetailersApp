import {NavigatorScreenParams} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {AppTabsNavigator, AppTabsNavigatorParams} from './app.tabs.navigator';
import {LoginScreen} from '~/Auth';
import {EditProfileScreen} from '~/User';

export type RootStackNavigatorParams = {
  Login: undefined;
  EditProfile: undefined;
  AppTabs: NavigatorScreenParams<AppTabsNavigatorParams>;
};

const Stack = createStackNavigator<RootStackNavigatorParams>();

export const RootStackNavigator = ({
  initialRouteName,
}: {
  initialRouteName: keyof RootStackNavigatorParams;
}) => {
  return (
    <Stack.Navigator initialRouteName={initialRouteName}>
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
        name="EditProfile"
        component={EditProfileScreen}
        options={{presentation: 'modal'}}
      />
    </Stack.Navigator>
  );
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackNavigatorParams {}
  }
}
