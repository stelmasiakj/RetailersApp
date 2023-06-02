import {apiClient} from '~/api';
import {createAppAsyncThunk} from '~/redux/create.app.async.thunk';
import {tokenStorage} from '../storage';

export const loginThunk = createAppAsyncThunk(
  'auth/login',
  async (args: {username: string; password: string}) => {
    const response = (await apiClient.post('/api/login', args)).data as {
      token: string;
    };

    await tokenStorage.write(response.token);

    return response;
  },
);
