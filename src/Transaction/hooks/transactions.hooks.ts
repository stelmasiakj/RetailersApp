import {createSelector} from '@reduxjs/toolkit';
import {useCallback, useMemo} from 'react';
import {TransactionListItem} from '~/domain';
import type {TRootState} from '~/redux/types';
import {useAppSelector} from '~/redux/use.app.select';

const selectTransaction = (state: TRootState) => state.transaction;

const selectFilter = createSelector(selectTransaction, t => t.filter);
const selectIsFetchingList = createSelector(
  selectTransaction,
  t => t.isFetchingList,
);
const selectIsFetchingListError = createSelector(
  selectTransaction,
  t => t.isFetchingListError,
);
const selectListIds = createSelector(selectTransaction, t => t.listIds);
const selectListItems = createSelector(selectTransaction, t => t.listItems);
const selectListPage = createSelector(selectTransaction, t => t.listPage);
const selectListTotal = createSelector(selectTransaction, t => t.listTotal);
const selectRetailerTransactions = createSelector(
  selectTransaction,
  t => t.retailerTransactions,
);
const selectRetailerTransactionsIsFetching = createSelector(
  selectTransaction,
  t => t.retailerTransactionsIsFetching,
);
const selectRetailerTransactionsIsFetchingError = createSelector(
  selectTransaction,
  t => t.retailerTransactionsIsFetchingError,
);

const makeSelectTransactionList = () =>
  createSelector(
    (_: TRootState, type: 'ACTIVE' | 'FINISHED') => type,
    selectIsFetchingList,
    selectIsFetchingListError,
    selectListIds,
    selectListItems,
    selectListPage,
    selectListTotal,
    (
      type,
      isFetchingMap,
      isFetchingErrorMap,
      listIdsMap,
      listItemsDict,
      listPageMap,
      listTotalMap,
    ) => {
      const isFetching = isFetchingMap[type];
      const isError = isFetchingErrorMap[type];
      const listIds = listIdsMap[type];
      const page = listPageMap[type];
      const total = listTotalMap[type];

      const items = listIds
        ? listIds.reduce<TransactionListItem[]>((acc, transactionId) => {
            const transaction = listItemsDict[transactionId];
            if (transaction) {
              acc.push(transaction);
            }
            return acc;
          }, [])
        : null;

      return {
        items,
        page,
        isError,
        isFetching,
        areAllItemsLoaded:
          !listIds || total === null ? false : listIds.length >= total,
      };
    },
  );

const makeSelectRetailerTransactions = () =>
  createSelector(
    (_: TRootState, retailerId: number) => retailerId,
    selectRetailerTransactions,
    selectRetailerTransactionsIsFetching,
    selectRetailerTransactionsIsFetchingError,
    selectListItems,
    (
      retailerId,
      transactionsDict,
      isFetchingDict,
      isFetchingErrorDict,
      itemsDict,
    ) => {
      const isFetching = isFetchingDict[retailerId] || false;
      const isError = isFetchingErrorDict[retailerId] || false;
      const itemsIds = transactionsDict[retailerId];

      const items = itemsIds
        ? itemsIds.reduce<TransactionListItem[]>((acc, transactionId) => {
            const transaction = itemsDict[transactionId];
            if (transaction) {
              acc.push(transaction);
            }
            return acc;
          }, [])
        : null;

      return {
        isError,
        isFetching,
        items,
      };
    },
  );

export const useTransactionList = (type: 'ACTIVE' | 'FINISHED') => {
  const selector = useMemo(() => makeSelectTransactionList(), []);
  const selectCallback = useCallback(
    (state: TRootState) => selector(state, type),
    [type, selector],
  );
  return useAppSelector(selectCallback);
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
