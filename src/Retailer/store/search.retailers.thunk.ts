import {apiClient} from '~/api';
import {createAppAsyncThunk} from '~/redux/create.app.async.thunk';

export const searchRetailersThunk = createAppAsyncThunk(
  'retailers/searchRetailers',
  async ({search}: {search: string}) => {
    const response = await apiClient.searchRetailers({search});

    return response.retailers;
  },
);
