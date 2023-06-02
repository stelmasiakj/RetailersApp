import {apiClient} from '~/api';
import {createAppAsyncThunk} from '~/redux/create.app.async.thunk';
import qs from 'qs';
import {Retailer} from '~/domain';

const PAGE_SIZE = 15;

export const getRetailersThunk = createAppAsyncThunk(
  'retailers/get',
  async ({page}: {page: number}) => {
    const response = (
      await apiClient.get(
        `/api/retailers?${qs.stringify({
          page,
          pagesize: PAGE_SIZE,
        })}`,
      )
    ).data as {total: number; retailers: Retailer[]};

    return response;
  },
);
