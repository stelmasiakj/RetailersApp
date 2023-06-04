import {apiClient} from '~/api';
import {createAppAsyncThunk} from '~/redux/create.app.async.thunk';

export const deleteCreditCardThunk = createAppAsyncThunk(
  'creditCard/delete',
  async ({id}: {id: number; retailerId: number}) => {
    await apiClient.deleteCreditCard({id});
  },
);
