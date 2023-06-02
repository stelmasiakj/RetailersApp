import qs from 'qs';
import {apiClient} from '~/api';
import {TransactionListItem} from '~/domain';
import {createAppAsyncThunk} from '~/redux/create.app.async.thunk';

export const getRetailerTransactionsThunk = createAppAsyncThunk(
  'transactions/getRetailerTransactions',
  async ({retailerId}: {retailerId: number}) => {
    const response = (
      await apiClient.get(
        `/api/transactions?${qs.stringify({
          retailerids: retailerId,
        })}`,
      )
    ).data as {total: number; transactions: TransactionListItem[]};
    return response;
  },
);
