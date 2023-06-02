import {RouteProp, useRoute} from '@react-navigation/native';
import type {RetailerStackNavigatorParams} from '~/navigation/retailer.stack.navigator';

export const useRetailerId = () => {
  const {
    params: {id},
  } = useRoute<RouteProp<RetailerStackNavigatorParams, 'RetailerDetails'>>();
  return id;
};
