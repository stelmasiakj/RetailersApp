import {memo, useCallback} from 'react';
import {TransactionListBase} from '~/Transaction/components/transaction.list.base';
import {useAppDispatch} from '~/redux/use.app.dispatch';
import {useRetailerId} from '../use.retailer.id';
import {useRetailerTransactions} from '~/Transaction/hooks/transactions.hooks';
import {getRetailerTransactionsThunk} from '~/Transaction/store/get.retailer.transactions.thunk';

export const TransactionsTab = memo(() => {
  const retailerId = useRetailerId();
  const listData = useRetailerTransactions(retailerId);
  const dispatch = useAppDispatch();

  const loadCallback = useCallback(() => {
    return dispatch(getRetailerTransactionsThunk({retailerId}));
  }, [dispatch, retailerId]);

  return <TransactionListBase {...listData} loadCallback={loadCallback} />;
});
