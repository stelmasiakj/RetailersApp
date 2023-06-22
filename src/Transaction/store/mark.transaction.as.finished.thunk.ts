import {apiClient} from '~/api';
import {createAppAsyncThunk} from '~/redux/create.app.async.thunk';
import {getTransactionsThunk} from './get.transactions.thunk';

export const markTransactionAsFinishedThunk = createAppAsyncThunk(
  'transaction/markAsFinished',
  async ({id}: {id: number}, {dispatch}) => {
    await apiClient.markTransactionAsFinished({id});

    dispatch(getTransactionsThunk({page: 1, type: 'FINISHED'}));
  },
);
