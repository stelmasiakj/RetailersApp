import {apiClient} from '~/api';
import {createAppAsyncThunk} from '~/redux/create.app.async.thunk';

const PAGE_SIZE = 15;

export const getRetailersThunk = createAppAsyncThunk(
  'retailers/get',
  async ({page}: {page: number}) => {
    const response = apiClient.getRetailers({page, pageSize: PAGE_SIZE});

    return response;
  },
);
