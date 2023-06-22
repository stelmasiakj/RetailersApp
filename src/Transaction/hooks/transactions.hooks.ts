import {useCallback, useMemo} from 'react';
import type {TRootState} from '~/redux/types';
import {useAppSelector} from '~/redux/use.app.select';
import {
  selectActiveTransactionsList,
  selectFinishedTransactionsList,
  makeSelectRetailerTransactions,
  selectFilter,
} from './transactions.selectors';

export const useTransactionList = (type: 'ACTIVE' | 'FINISHED') => {
  return useAppSelector(
    type === 'ACTIVE'
      ? selectActiveTransactionsList
      : selectFinishedTransactionsList,
  );
};

export const useRetailerTransactions = (retailerId: number) => {
  const selector = useMemo(() => makeSelectRetailerTransactions(), []);
  const selectCallback = useCallback(
    (state: TRootState) => selector(state, retailerId),
    [retailerId, selector],
  );
  return useAppSelector(selectCallback);
};

export const useTransactionsFilter = () => {
  return (
    useAppSelector(selectFilter) || {
      maxStart: null,
      minStart: null,
      retailerIds: [],
    }
  );
};
