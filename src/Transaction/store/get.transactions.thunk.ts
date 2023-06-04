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
              ? getTimeOfDay(filter.minStart, 0, 0)
              : null,
            maxstart: filter?.maxStart
              ? getTimeOfDay(filter.maxStart, 23, 59)
              : null,
          },
          {skipNulls: true},
        )}`,
      )
    ).data as {total: number; transactions: TransactionListItem[]};
    return response;
  },
);

const getTimeOfDay = (v: string, hours: number, minutes: number) => {
  const date = new Date(v);
  date.setHours(hours);
  date.setMinutes(minutes);
  return date.getTime();
};
