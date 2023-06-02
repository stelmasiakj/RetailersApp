import {createAppAsyncThunk} from '~/redux/create.app.async.thunk';
import {tokenStorage} from '../storage';

export const logoutThunk = createAppAsyncThunk('auth/logout', async () => {
  await tokenStorage.clear();
});
