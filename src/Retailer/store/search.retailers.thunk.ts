import {apiClient} from '~/api';
import {createAppAsyncThunk} from '~/redux/create.app.async.thunk';

export const searchRetailersThunk = createAppAsyncThunk(
  'retailers/searchRetailers',
  async () => {
    const response = await apiClient.searchRetailers();

    return response.retailers;
  },
);
