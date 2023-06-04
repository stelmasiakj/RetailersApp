import {apiClient} from '~/api';
import {createAppAsyncThunk} from '~/redux/create.app.async.thunk';

export const getRetailerTransactionsThunk = createAppAsyncThunk(
  'transactions/getRetailerTransactions',
  async ({retailerId}: {retailerId: number}) => {
    const response = await apiClient.getRetailerTransactions({retailerId});
    return response;
  },
);
