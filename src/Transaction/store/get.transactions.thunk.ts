import {apiClient} from '~/api';
import {createAppAsyncThunk} from '~/redux/create.app.async.thunk';

const PAGE_SIZE = 100;

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
      pageSize: PAGE_SIZE,
      type,
    });

    return response;
  },
);
