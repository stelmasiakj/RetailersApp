import {apiClient} from '~/api';
import {CreditCard} from '~/domain';
import {createAppAsyncThunk} from '~/redux/create.app.async.thunk';

export const addCreditCardThunk = createAppAsyncThunk(
  'creditCard/add',
  async (args: {
    cv2: string;
    cardNumber: string;
    ownerId: string;
    expires: string;
  }) => {
    const response = (await apiClient.post('/api/creditcard', args)).data as {
      card: CreditCard;
    };
    return response.card;
  },
);
