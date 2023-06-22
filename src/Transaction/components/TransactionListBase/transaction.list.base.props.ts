import {Animated, StyleProp, ViewStyle} from 'react-native';
import {TransactionListItem} from '~/domain';

export type TransactionListBaseProps = {
  areAllItemsLoaded?: boolean;
  isError: boolean;
  isFetching: boolean;
  items: TransactionListItem[] | null;
  page?: number;
  loadCallback: (page: number) => Promise<unknown>;
  contentContainerStyle?: StyleProp<ViewStyle>;
  topInset?: number;
  onScroll?: React.ComponentProps<typeof Animated.FlatList>['onScroll'];
  testID?: string;
};
