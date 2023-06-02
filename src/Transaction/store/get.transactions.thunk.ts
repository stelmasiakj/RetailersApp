import qs from 'qs';
import {apiClient} from '~/api';
import {TransactionListItem} from '~/domain';
import {createAppAsyncThunk} from '~/redux/create.app.async.thunk';

const PAGE_SIZE = 20;

export const getTransactionsThunk = createAppAsyncThunk(
  'transactions/get',
  async (
    {page, type}: {page: number; type: 'ACTIVE' | 'FINISHED'},
    {getState},
  ) => {
    const {
      transaction: {filter},
    } = getState();

    const response = (
      await apiClient.get(
        `/api/transactions?${qs.stringify(
          {
            page,
            pagesize: PAGE_SIZE,

            statuses: (type === 'ACTIVE'
              ? ['PENDING', 'REJECTED']
              : ['FINISHED']
            ).join('|'),
            retailerids: filter?.retailerIds
              ? filter.retailerIds.join('|')
              : null,
            minstart: filter?.minStart
              ? new Date(filter.minStart).getTime()
              : null,
            maxstart: filter?.maxStart
              ? new Date(filter.maxStart).getTime()
              : null,
          },
          {skipNulls: true},
        )}`,
      )
    ).data as {total: number; transactions: TransactionListItem[]};
    return response;
  },
);
