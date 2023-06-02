import {memo, useCallback} from 'react';
import {TransactionListBase} from '~/Transaction/components';
import {useTransactionList} from '~/Transaction/hooks';
import {getTransactionsThunk} from '~/Transaction/store';
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

  return <TransactionListBase {...listData} loadCallback={loadTransactions} />;
});
