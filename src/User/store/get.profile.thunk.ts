import {apiClient} from '~/api';
import {User} from '~/domain';
import {createAppAsyncThunk} from '~/redux/create.app.async.thunk';

export const getProfileThunk = createAppAsyncThunk(
  'user/getProfile',
  async () => {
    const response = (await apiClient.get('/api/profile')).data as {user: User};

    return response.user;
  },
);
