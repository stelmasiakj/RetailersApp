import {createSelector} from '@reduxjs/toolkit';
import {useCallback, useMemo} from 'react';
import {CreditCardListItem, RetailerListItem} from '~/domain';
import type {TRootState} from '~/redux/types';
import {useAppSelector} from '~/redux/use.app.select';

const selectRetailer = (state: TRootState) => state.retailer;

const selectCreditCards = createSelector(selectRetailer, r => r.creditCards);
const selectIsFetchingRetailerCreditCards = createSelector(
  selectRetailer,
  r => r.isFetchingRetailerCreditCards,
);
const selectIsFetchingRetailerCreditCardsError = createSelector(
  selectRetailer,
  r => r.isFetchingRetailerCreditCardsError,
);
const selectRetailerCreditCards = createSelector(
  selectRetailer,
  r => r.retailerCreditCards,
);
const selectRetailerListItems = createSelector(
  selectRetailer,
  r => r.retailerListItems,
);
const selectIsFetchingRetailers = createSelector(
  selectRetailer,
  r => r.isFetchingRetailers,
);
const selectIsFetchingRetailersError = createSelector(
  selectRetailer,
  r => r.isFetchingRetailersError,
);
const selectTotalRetailers = createSelector(
  selectRetailer,
  r => r.totalRetailers,
);
const selectRetailersPage = createSelector(
  selectRetailer,
  r => r.retailersPage,
);
const selectRetailerListIds = createSelector(
  selectRetailer,
  r => r.retailerListIds,
);
const selectSearchedRetailersIds = createSelector(
  selectRetailer,
  r => r.searchedRetailersIds,
);
const selectRetailerDetails = createSelector(
  selectRetailer,
  r => r.retailerDetails,
);
const selectIsFetchingRetailerDetails = createSelector(
  selectRetailer,
  r => r.isFetchingRetailerDetails,
);
const selectIsFetchingRetailerDetailsError = createSelector(
  selectRetailer,
  r => r.isFetchingRetailerDetailsError,
);

const makSelectRetailerCreditCardsItems = () =>
  createSelector(
    (_: TRootState, id: number) => id,
    selectCreditCards,
    selectRetailerCreditCards,
    (retailerId, cardsDict, retailerCreditCardsIdsDict) => {
      const retailerCreditCardsIds = retailerCreditCardsIdsDict[retailerId];
      if (!retailerCreditCardsIds) {
        return null;
      }
      return retailerCreditCardsIds.reduce<CreditCardListItem[]>(
        (acc, cardId) => {
          const card = cardsDict[cardId];
          if (card) {
            acc.push(card);
          }
          return acc;
        },
        [],
      );
    },
  );

const makSelectRetailerCreditCardsIsFetching = () =>
  createSelector(
    (_: TRootState, id: number) => id,
    selectIsFetchingRetailerCreditCards,
    (retailerId, isFetchingCardsDict) => {
      return isFetchingCardsDict[retailerId] || false;
    },
  );

const makSelectRetailerCreditCardsIsFetchingError = () =>
  createSelector(
    (_: TRootState, id: number) => id,
    selectIsFetchingRetailerCreditCardsError,
    (retailerId, isFetchingCardsErrorDict) => {
      return isFetchingCardsErrorDict[retailerId] || false;
    },
  );

const selectRetailerSearchItems = createSelector(
  selectRetailerListItems,
  selectSearchedRetailersIds,
  (listItemsDict, searchItemsIds) => {
    if (!searchItemsIds) {
      return null;
    }
    return searchItemsIds.reduce<RetailerListItem[]>((acc, cardId) => {
      const item = listItemsDict[cardId];
      if (item) {
        acc.push(item);
      }
      return acc;
    }, []);
  },
);

const makeSelectRetailerDetails = () =>
  createSelector(
    (_: TRootState, id: number) => id,
    selectRetailerDetails,
    selectIsFetchingRetailerDetails,
    selectIsFetchingRetailerDetailsError,
    (
      retailerId,
      detailsDict,
      isFetchingDetailsDict,
      isFetchingDetailsErrorDict,
    ) => {
      const details = detailsDict[retailerId] || null;
      const isFetching = isFetchingDetailsDict[retailerId] || false;
      const isError = isFetchingDetailsErrorDict[retailerId] || false;
      return {details, isError, isFetching};
    },
  );

const selectRetailerList = createSelector(
  selectRetailerListItems,
  selectIsFetchingRetailers,
  selectIsFetchingRetailersError,
  selectTotalRetailers,
  selectRetailersPage,
  selectRetailerListIds,
  (listItemsDict, isFetching, isError, total, page, ids) => {
    const itemsByFirstLetter = (ids || []).reduce<{
      [firstLetter: string]: RetailerListItem[];
    }>((acc, itemId) => {
      const item = listItemsDict[itemId];
      if (item) {
        const firstLetter = item.firstName[0].toUpperCase();
        if (acc[firstLetter]) {
          acc[firstLetter].push(item);
        } else {
          acc[firstLetter] = [item];
        }
      }
      return acc;
    }, {});

    const items = ids
      ? Object.keys(itemsByFirstLetter)
          .map(firstLetter => {
            return {
              title: firstLetter,
              data: itemsByFirstLetter[firstLetter],
            };
          })
          .sort((i1, i2) =>
            i1.title > i2.title ? 1 : i1.title < i2.title ? -1 : 0,
          )
      : null;

    return {
      items,
      page,
      isError,
      isFetching,
      areAllItemsLoaded: !ids || total === null ? false : ids.length >= total,
    };
  },
);

const makeSelectRetailerListItem = () =>
  createSelector(
    (_: TRootState, id: number) => id,
    selectRetailerListItems,
    (id, items) => {
      return items[id];
    },
  );

export const useRetailerListItem = (id: number) => {
  const select = useMemo(() => makeSelectRetailerListItem(), []);
  const selector = useCallback(
    (state: TRootState) => select(state, id),
    [id, select],
  );
  return useAppSelector(selector);
};

export const useRetailers = () => useAppSelector(selectRetailerList);

export const useRetailersSearch = () =>
  useAppSelector(selectRetailerSearchItems);

export const useRetailerDetails = (id: number) => {
  const select = useMemo(() => makeSelectRetailerDetails(), []);
  const selector = useCallback(
    (state: TRootState) => select(state, id),
    [id, select],
  );

  return useAppSelector(selector);
};

export const useRetailerCreditCards = (id: number) => {
  const selectCards = useMemo(() => makSelectRetailerCreditCardsItems(), []);
  const cardsSelector = useCallback(
    (state: TRootState) => selectCards(state, id),
    [selectCards, id],
  );

  const selectIsFetchingCards = useMemo(
    () => makSelectRetailerCreditCardsIsFetching(),
    [],
  );
  const isFetchingCardsSelector = useCallback(
    (state: TRootState) => selectIsFetchingCards(state, id),
    [selectIsFetchingCards, id],
  );

  const selectIsFetchingCardsError = useMemo(
    () => makSelectRetailerCreditCardsIsFetchingError(),
    [],
  );
  const isFetchingCardsErrorSelector = useCallback(
    (state: TRootState) => selectIsFetchingCardsError(state, id),
    [selectIsFetchingCardsError, id],
  );

  const cards = useAppSelector(cardsSelector);
  const isFetching = useAppSelector(isFetchingCardsSelector);
  const isError = useAppSelector(isFetchingCardsErrorSelector);

  return useMemo(
    () => ({
      cards,
      isError,
      isFetching,
    }),
    [cards, isFetching, isError],
  );
};
