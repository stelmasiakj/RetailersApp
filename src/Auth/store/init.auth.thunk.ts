import {createAppAsyncThunk} from '~/redux/create.app.async.thunk';
import {tokenStorage} from '../storage';

export const initAuthThunk = createAppAsyncThunk('auth/init', async () => {
  const token = await tokenStorage.read();
  return {token};
});
