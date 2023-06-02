import {createStackNavigator} from '@react-navigation/stack';
import {RetailerDetailsScreen, RetailerListScreen} from '~/Retailer';

export type RetailerStackNavigatorParams = {
  RetailerList: undefined;
  RetailerDetails: {id: number};
};

const Stack = createStackNavigator<RetailerStackNavigatorParams>();

export const RetailerStackNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="RetailerList">
      <Stack.Screen name="RetailerList" component={RetailerListScreen} />
      <Stack.Screen name="RetailerDetails" component={RetailerDetailsScreen} />
    </Stack.Navigator>
  );
};
