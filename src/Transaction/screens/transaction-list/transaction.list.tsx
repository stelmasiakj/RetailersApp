import {memo, useCallback} from 'react';
import {TransactionListBase} from '~/Transaction/components';
import {useTransactionList} from '~/Transaction/hooks';
import {getTransactionsThunk} from '~/Transaction/store';
import {useStylesheet} from '~/designSystem';
import {useCustomTabbarHeight} from '~/navigationElements';
import {useAppDispatch} from '~/redux/use.app.dispatch';

export const TransactionList = memo(({type}: {type: 'ACTIVE' | 'FINISHED'}) => {
  const dispatch = useAppDispatch();
  const listData = useTransactionList(type);

  const loadTransactions = useCallback(
    (page: number) => {
      return dispatch(getTransactionsThunk({page, type}));
    },
    [dispatch, type],
  );

  const tabbarHeight = useCustomTabbarHeight();

  const styles = useStylesheet(
    ({spacing}) => ({
      content: {
        paddingBottom: spacing[20] + tabbarHeight,
      },
    }),
    [tabbarHeight],
  );

  return (
    <TransactionListBase
      {...listData}
      loadCallback={loadTransactions}
      contentContainerStyle={styles.content}
    />
  );
});
