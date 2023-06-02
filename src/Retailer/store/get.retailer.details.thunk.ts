import {apiClient} from '~/api';
import {Retailer} from '~/domain';
import {createAppAsyncThunk} from '~/redux/create.app.async.thunk';

export const getRetailerDetailsThunk = createAppAsyncThunk(
  'retailers/getDetails',
  async ({id}: {id: number}) => {
    const response = (await apiClient.get(`/api/retailer/${id}`)).data as {
      retailer: Retailer;
    };

    return response.retailer;
  },
);
