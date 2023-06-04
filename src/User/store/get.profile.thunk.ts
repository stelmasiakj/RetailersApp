import {apiClient} from '~/api';

import {createAppAsyncThunk} from '~/redux/create.app.async.thunk';

export const getProfileThunk = createAppAsyncThunk(
  'user/getProfile',
  async () => {
    const response = await apiClient.getProfile();

    return response.user;
  },
);
