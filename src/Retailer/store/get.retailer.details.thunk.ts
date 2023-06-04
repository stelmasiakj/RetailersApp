import {apiClient} from '~/api';
import {createAppAsyncThunk} from '~/redux/create.app.async.thunk';

export const getRetailerDetailsThunk = createAppAsyncThunk(
  'retailers/getDetails',
  async ({id}: {id: number}) => {
    const response = await apiClient.getRetailerDetails({id});

    return response.retailer;
  },
);
