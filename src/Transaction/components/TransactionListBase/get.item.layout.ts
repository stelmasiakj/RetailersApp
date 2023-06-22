import {
  TRANSACTION_LIST_ITEM_HEIGHT,
  TRANSACTION_LIST_ITEM_SEPARATOR,
} from '~/Transaction/constants';
import {TransactionListItem} from '~/domain';

export const getItemLayout = (
  data: Array<TransactionListItem> | null | undefined,
  index: number,
): {length: number; offset: number; index: number} => {
  if (!data) {
    return {index: 0, length: 0, offset: 0};
  }
  return {
    index,
    length: TRANSACTION_LIST_ITEM_HEIGHT,
    offset:
      (TRANSACTION_LIST_ITEM_HEIGHT + TRANSACTION_LIST_ITEM_SEPARATOR) * index,
  };
};
