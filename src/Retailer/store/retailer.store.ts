import {createSlice} from '@reduxjs/toolkit';
import {CreditCardListItem, RetailerDetails, RetailerListItem} from '~/domain';
import {getRetailerDetailsThunk} from './get.retailer.details.thunk';
import {getRetailersThunk} from './get.retailers.thunk';
import {searchRetailersThunk} from './search.retailers.thunk';
import {getRetailerCreditCardsThunk} from './get.retailer.credit.cards.thunk';
import {logoutThunk} from '~/Auth';
import {deleteCreditCardThunk} from './delete.credit.card.thunk';

type Dict<T> = Record<number, T | undefined>;

interface IRetailerState {
  creditCards: Dict<CreditCardListItem>;
  isFetchingRetailerCreditCards: Dict<boolean>;
  isFetchingRetailerCreditCardsError: Dict<boolean>;
  retailerCreditCards: Dict<number[]>;

  retailerListItems: Dict<RetailerListItem>;
  isFetchingRetailers: boolean;
  isFetchingRetailersError: boolean;
  totalRetailers: number | null;
  retailersPage: number;
  retailerListIds: number[] | null;
  searchedRetailersIds: number[] | null;

  retailerDetails: Dict<RetailerDetails>;
  isFetchingRetailerDetails: Dict<boolean>;
  isFetchingRetailerDetailsError: Dict<boolean>;
}

const initialState: IRetailerState = {
  creditCards: {},
  isFetchingRetailerCreditCards: {},
  isFetchingRetailerCreditCardsError: {},
  retailerCreditCards: {},

  retailerListItems: {},
  isFetchingRetailers: false,
  isFetchingRetailersError: false,
  totalRetailers: null,
  retailersPage: 0,
  retailerListIds: null,
  searchedRetailersIds: null,

  retailerDetails: {},
  isFetchingRetailerDetails: {},
  isFetchingRetailerDetailsError: {},
};

const retailerStore = createSlice({
  name: 'retailer',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(
        getRetailerDetailsThunk.pending,
        (
          state,
          {
            meta: {
              arg: {id},
            },
          },
        ) => {
          state.isFetchingRetailerDetails[id] = true;
        },
      )
      .addCase(
        getRetailerDetailsThunk.rejected,
        (
          state,
          {
            meta: {
              arg: {id},
            },
          },
        ) => {
          state.isFetchingRetailerDetails[id] = false;
          state.isFetchingRetailerDetailsError[id] = true;
        },
      )
      .addCase(
        getRetailerDetailsThunk.fulfilled,
        (
          state,
          {
            payload,
            meta: {
              arg: {id},
            },
          },
        ) => {
          state.isFetchingRetailerDetails[id] = false;
          state.isFetchingRetailerDetailsError[id] = false;
          state.retailerDetails[id] = payload;
        },
      );

    builder
      .addCase(getRetailersThunk.pending, state => {
        state.isFetchingRetailers = true;
      })
      .addCase(getRetailersThunk.rejected, state => {
        state.isFetchingRetailers = false;
        state.isFetchingRetailersError = true;
      })
      .addCase(
        getRetailersThunk.fulfilled,
        (
          state,
          {
            payload: {retailers, total},
            meta: {
              arg: {page},
            },
          },
        ) => {
          state.isFetchingRetailers = false;
          state.isFetchingRetailersError = false;
          state.totalRetailers = total;
          state.retailersPage = page;
          retailers.forEach(r => {
            state.retailerListItems[r.id] = r;
          });
          const ids = retailers.map(r => r.id);
          state.retailerListIds =
            page === 1 ? ids : (state.retailerListIds || []).concat(ids);
        },
      );

    builder.addCase(
      searchRetailersThunk.fulfilled,
      (state, {payload: retailers}) => {
        retailers.forEach(r => {
          state.retailerListItems[r.id] = r;
        });
        state.searchedRetailersIds = retailers.map(r => r.id);
      },
    );

    builder
      .addCase(
        getRetailerCreditCardsThunk.pending,
        (
          state,
          {
            meta: {
              arg: {retailerId},
            },
          },
        ) => {
          state.isFetchingRetailerCreditCards[retailerId] = true;
        },
      )
      .addCase(
        getRetailerCreditCardsThunk.rejected,
        (
          state,
          {
            meta: {
              arg: {retailerId},
            },
          },
        ) => {
          state.isFetchingRetailerCreditCards[retailerId] = false;
          state.isFetchingRetailerCreditCardsError[retailerId] = true;
        },
      )
      .addCase(
        getRetailerCreditCardsThunk.fulfilled,
        (
          state,
          {
            meta: {
              arg: {retailerId},
            },
            payload: creditCards,
          },
        ) => {
          state.isFetchingRetailerCreditCards[retailerId] = false;
          state.isFetchingRetailerCreditCardsError[retailerId] = false;

          creditCards.forEach(c => {
            state.creditCards[c.id] = c;
          });
          state.retailerCreditCards[retailerId] = creditCards.map(c => c.id);
        },
      );

    builder.addCase(
      deleteCreditCardThunk.fulfilled,
      (
        state,
        {
          meta: {
            arg: {id, retailerId},
          },
        },
      ) => {
        state.retailerCreditCards[retailerId] = (
          state.retailerCreditCards[retailerId] || []
        ).filter(i => i !== id);
        delete state.creditCards[id];
      },
    );

    builder.addCase(logoutThunk.fulfilled, () => ({...initialState}));
  },
});

export const retailerReducer = retailerStore.reducer;
