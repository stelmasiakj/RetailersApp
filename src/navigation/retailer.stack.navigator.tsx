import {StackHeaderProps, createStackNavigator} from '@react-navigation/stack';
import {useTranslation} from 'react-i18next';
import {RetailerDetailsScreen, RetailerListScreen} from '~/Retailer';
import {CustomNavigationHeader} from '~/navigationElements';

export type RetailerStackNavigatorParams = {
  RetailerList: undefined;
  RetailerDetails: {id: number};
};

const Stack = createStackNavigator<RetailerStackNavigatorParams>();

const renderCustomHeader = (props: StackHeaderProps) => (
  <CustomNavigationHeader {...props} />
);

export const RetailerStackNavigator = () => {
  const [t] = useTranslation();
  return (
    <Stack.Navigator
      initialRouteName="RetailerList"
      screenOptions={{
        headerBackTitleVisible: false,
        header: renderCustomHeader,
      }}>
      <Stack.Screen name="RetailerList" component={RetailerListScreen} />
      <Stack.Screen
        name="RetailerDetails"
        component={RetailerDetailsScreen}
        options={{title: t('retailer.detailsTitle')}}
      />
    </Stack.Navigator>
  );
};
