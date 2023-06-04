import {apiClient} from '~/api';
import {createAppAsyncThunk} from '~/redux/create.app.async.thunk';

export const updateProfileThunk = createAppAsyncThunk(
  'user/updateProfile',
  async (args: {firstName: string; lastName: string; email: string}) => {
    await apiClient.updateProfile(args);
  },
);
