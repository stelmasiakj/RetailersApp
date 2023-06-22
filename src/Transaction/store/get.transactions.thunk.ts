import {apiClient} from '~/api';
import {createAppAsyncThunk} from '~/redux/create.app.async.thunk';
import {TRANSACTION_LIST_PAGE_SIZE} from '../constants';

export const getTransactionsThunk = createAppAsyncThunk(
  'transactions/get',
  async (
    {page, type}: {page: number; type: 'ACTIVE' | 'FINISHED'},
    {getState},
  ) => {
    const {
      transaction: {filter},
    } = getState();

    const response = await apiClient.getTransactions({
      filter,
      page,
      pageSize: TRANSACTION_LIST_PAGE_SIZE,
      type,
    });

    return response;
  },
);
