import {createSelector} from '@reduxjs/toolkit';
import {createSelectorCreator, defaultMemoize} from 'reselect';
import {TransactionListItem} from '~/domain';
import type {TRootState} from '~/redux/types';
import isEqual from 'lodash.isequal';

const createDeepEqualSelector = createSelectorCreator(defaultMemoize, isEqual);

const selectTransaction = (state: TRootState) => state.transaction;

export const selectFilter = createSelector(selectTransaction, t => t.filter);
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

const selectActiveListPage = createSelector(selectListPage, v => v.ACTIVE);
const selectFinishedListPage = createSelector(selectListPage, v => v.ACTIVE);

const selectActiveIsFetchingListError = createSelector(
  selectIsFetchingListError,
  v => v.ACTIVE,
);
const selectFinishedIsFetchingListError = createSelector(
  selectIsFetchingListError,
  v => v.FINISHED,
);

const selectActiveListIsFetching = createSelector(
  selectIsFetchingList,
  v => v.ACTIVE,
);
const selectFinishedListIsFetching = createSelector(
  selectIsFetchingList,
  v => v.FINISHED,
);

const selectActiveListTotal = createSelector(selectListTotal, v => v.ACTIVE);
const selectFinishedListTotal = createSelector(
  selectListTotal,
  v => v.FINISHED,
);

const selectActiveTransactionsListIds = createSelector(
  selectListIds,
  v => v.ACTIVE,
);
const selectFinishedTransactionsListIds = createSelector(
  selectListIds,
  v => v.FINISHED,
);

const selectActiveTransactionsListItems = createSelector(
  selectActiveTransactionsListIds,
  selectListItems,
  (ids, itemsDict) => {
    return (ids || []).reduce<TransactionListItem[]>((acc, id) => {
      const item = itemsDict[id];
      if (item) {
        acc.push(item);
      }
      return acc;
    }, []);
  },
);
const selectFinishedTransactionsListItems = createSelector(
  selectFinishedTransactionsListIds,
  selectListItems,
  (ids, itemsDict) => {
    return (ids || []).reduce<TransactionListItem[]>((acc, id) => {
      const item = itemsDict[id];
      if (item) {
        acc.push(item);
      }
      return acc;
    }, []);
  },
);

export const selectActiveTransactionsList = createDeepEqualSelector(
  selectActiveListPage,
  selectActiveIsFetchingListError,
  selectActiveListIsFetching,
  selectActiveListTotal,
  selectActiveTransactionsListItems,
  (page, isError, isFetching, total, items) => {
    return {
      items,
      page,
      isError,
      isFetching,
      areAllItemsLoaded: total === null ? false : items.length >= total,
    };
  },
);

export const selectFinishedTransactionsList = createDeepEqualSelector(
  selectFinishedListPage,
  selectFinishedIsFetchingListError,
  selectFinishedListIsFetching,
  selectFinishedListTotal,
  selectFinishedTransactionsListItems,
  (page, isError, isFetching, total, items) => {
    return {
      items,
      page,
      isError,
      isFetching,
      areAllItemsLoaded: total === null ? false : items.length >= total,
    };
  },
);

export const makeSelectRetailerTransactions = () =>
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

export const makeSelectTransactionListItemIndex = () =>
  createSelector(
    (_: TRootState, id: number) => id,
    selectListIds,
    (id, ids) => {
      const index = (ids.ACTIVE || []).indexOf(id);

      return index;
    },
  );
