import {apiClient} from '~/api';
import {createAppAsyncThunk} from '~/redux/create.app.async.thunk';

export const deleteCreditCardThunk = createAppAsyncThunk(
  'creditCard/delete',
  async ({id}: {id: string}) => {
    await apiClient.delete(`/api/creditcard/${id}`);
  },
);