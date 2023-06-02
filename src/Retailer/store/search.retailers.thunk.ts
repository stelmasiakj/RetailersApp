import qs from 'qs';
import {apiClient} from '~/api';
import {Retailer} from '~/domain';
import {createAppAsyncThunk} from '~/redux/create.app.async.thunk';

export const searchRetailersThunk = createAppAsyncThunk(
  'retailers/searchRetailers',
  async () => {
    const response = (
      await apiClient.get(
        `/api/retailers?${qs.stringify({
          page: 1,
          pagesize: 100,
        })}`,
      )
    ).data as {total: number; retailers: Retailer[]};

    return response.retailers;
  },
);
