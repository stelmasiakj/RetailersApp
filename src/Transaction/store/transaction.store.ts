import {PayloadAction, createSlice} from '@reduxjs/toolkit';
import {logoutThunk} from '~/Auth';
import {TransactionListItem} from '~/domain';
import {getTransactionsThunk} from './get.transactions.thunk';
import {getRetailerTransactionsThunk} from './get.retailer.transactions.thunk';

type Dict<T> = Record<number, T | undefined>;

type StatusMap<T> = Record<'ACTIVE' | 'FINISHED', T>;

interface ITransactionState {
  filter: {
    minStart: string | null;
    maxStart: string | null;
    retailerIds: number[] | null;
  } | null;

  listItems: Dict<TransactionListItem>;
  isFetchingList: StatusMap<boolean>;
  isFetchingListError: StatusMap<boolean>;
  listTotal: StatusMap<number | null>;
  listPage: StatusMap<number>;
  listIds: StatusMap<number[] | null>;

  retailerTransactions: Dict<number[]>;
  retailerTransactionsIsFetching: Dict<boolean>;
  retailerTransactionsIsFetchingError: Dict<boolean>;
}

const initialState: ITransactionState = {
  filter: null,
  listPage: {
    ACTIVE: 0,
    FINISHED: 0,
  },
  isFetchingList: {
    ACTIVE: false,
    FINISHED: false,
  },
  isFetchingListError: {
    ACTIVE: false,
    FINISHED: false,
  },
  listItems: {},
  listIds: {
    ACTIVE: null,
    FINISHED: null,
  },
  listTotal: {
    ACTIVE: null,
    FINISHED: null,
  },
  retailerTransactions: {},
  retailerTransactionsIsFetching: {},
  retailerTransactionsIsFetchingError: {},
};

const transactionStore = createSlice({
  name: 'transaction',
  initialState,
  reducers: {
    setTransactionFilterAction: (
      state,
      action: PayloadAction<ITransactionState['filter']>,
    ) => {
      state.filter = action.payload;
    },
    resetTransactionListAction: state => {
      state.listItems = initialState.listItems;
      state.isFetchingList = initialState.isFetchingList;
      state.isFetchingListError = initialState.isFetchingListError;
      state.listTotal = initialState.listTotal;
      state.listPage = initialState.listPage;
      state.listIds = initialState.listIds;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(
        getTransactionsThunk.pending,
        (
          state,
          {
            meta: {
              arg: {type},
            },
          },
        ) => {
          state.isFetchingList[type] = true;
        },
      )
      .addCase(
        getTransactionsThunk.rejected,
        (
          state,
          {
            meta: {
              arg: {type},
            },
          },
        ) => {
          state.isFetchingList[type] = false;
          state.isFetchingListError[type] = true;
        },
      )
      .addCase(
        getTransactionsThunk.fulfilled,
        (
          state,
          {
            meta: {
              arg: {type, page},
            },
            payload: {total, transactions},
          },
        ) => {
          state.isFetchingList[type] = false;
          state.isFetchingListError[type] = false;

          state.isFetchingList[type] = false;
          state.isFetchingListError[type] = false;
          state.listTotal[type] = total;
          state.listPage[type] = page;

          transactions.forEach(t => {
            state.listItems[t.id] = t;
          });

          const ids = transactions.map(r => r.id);
          state.listIds[type] =
            page === 1 ? ids : (state.listIds[type] || []).concat(ids);
        },
      );

    builder
      .addCase(
        getRetailerTransactionsThunk.pending,
        (
          state,
          {
            meta: {
              arg: {retailerId},
            },
          },
        ) => {
          state.retailerTransactionsIsFetching[retailerId] = true;
        },
      )
      .addCase(
        getRetailerTransactionsThunk.rejected,
        (
          state,
          {
            meta: {
              arg: {retailerId},
            },
          },
        ) => {
          state.retailerTransactionsIsFetching[retailerId] = false;
          state.retailerTransactionsIsFetchingError[retailerId] = true;
        },
      )
      .addCase(
        getRetailerTransactionsThunk.fulfilled,
        (
          state,
          {
            meta: {
              arg: {retailerId},
            },
            payload: {transactions},
          },
        ) => {
          state.retailerTransactionsIsFetching[retailerId] = false;
          state.retailerTransactionsIsFetchingError[retailerId] = false;
          transactions.forEach(t => {
            state.listItems[t.id] = t;
          });
          state.retailerTransactions[retailerId] = transactions.map(i => i.id);
        },
      );

    builder.addCase(logoutThunk.fulfilled, () => ({...initialState}));
  },
});

export const {resetTransactionListAction, setTransactionFilterAction} =
  transactionStore.actions;

export const transactionReducer = transactionStore.reducer;
