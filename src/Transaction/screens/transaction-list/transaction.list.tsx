import {memo, useCallback} from 'react';
import {TransactionListBase} from '~/Transaction/components';
import {useTransactionList} from '~/Transaction/hooks';
import {getTransactionsThunk} from '~/Transaction/store';
import {useStylesheet} from '~/designSystem';
import {useCustomTabbarHeight} from '~/navigationElements';
import {useAppDispatch} from '~/redux/use.app.dispatch';
import {useHeaderHeight} from './use.header.height';
import Animated, {useAnimatedScrollHandler} from 'react-native-reanimated';
import {APP_HEADER_HEIGHT} from '~/components/AppHeader/app.header.constants';
import {clampWorklet} from '~/utils';

export const TransactionList = memo(
  ({
    type,
    headerTranslateY,
  }: {
    type: 'ACTIVE' | 'FINISHED';
    headerTranslateY: Animated.SharedValue<number>;
  }) => {
    const dispatch = useAppDispatch();
    const listData = useTransactionList(type);

    const loadTransactions = useCallback(
      (page: number) => {
        return dispatch(getTransactionsThunk({page, type}));
      },
      [dispatch, type],
    );

    const tabbarHeight = useCustomTabbarHeight();
    const headerHeight = useHeaderHeight();

    const styles = useStylesheet(
      ({spacing}) => ({
        content: {
          paddingBottom: spacing[20] + tabbarHeight,
        },
      }),
      [tabbarHeight],
    );

    const onScroll = useAnimatedScrollHandler<{prevScrollY: number}>(
      {
        onBeginDrag: (event, ctx) => {
          const maxAllowedScrollY =
            event.contentSize.height - event.layoutMeasurement.height;
          const scrollY = clampWorklet(
            event.contentOffset.y,
            0,
            maxAllowedScrollY,
          );
          ctx.prevScrollY = scrollY;
        },
        onScroll: (event, ctx) => {
          const maxAllowedScrollY =
            event.contentSize.height - event.layoutMeasurement.height;
          const scrollY = clampWorklet(
            event.contentOffset.y,
            0,
            maxAllowedScrollY,
          );
          const diff = (scrollY - (ctx.prevScrollY || 0)) / 4;

          headerTranslateY.value = clampWorklet(
            headerTranslateY.value - diff,
            -APP_HEADER_HEIGHT,
            0,
          );

          ctx.prevScrollY = scrollY;
        },
      },
      [],
    );

    return (
      <TransactionListBase
        {...listData}
        loadCallback={loadTransactions}
        contentContainerStyle={styles.content}
        topInset={headerHeight}
        onScroll={onScroll}
        testID={`TransactionList_${type}`}
      />
    );
  },
);
