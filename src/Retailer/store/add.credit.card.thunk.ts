import {apiClient} from '~/api';
import {createAppAsyncThunk} from '~/redux/create.app.async.thunk';
import {getRetailerCreditCardsThunk} from './get.retailer.credit.cards.thunk';

export const addCreditCardThunk = createAppAsyncThunk(
  'creditCard/add',
  async (
    args: {
      cv2: string;
      cardNumber: string;
      ownerId: number;
      expires: string;
    },
    thunkAPI,
  ) => {
    const response = await apiClient.addCreditCard(args);

    await thunkAPI.dispatch(
      getRetailerCreditCardsThunk({retailerId: args.ownerId}),
    );

    return response.card;
  },
);
