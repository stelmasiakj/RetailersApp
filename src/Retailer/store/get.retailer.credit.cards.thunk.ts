import {apiClient} from '~/api';
import {createAppAsyncThunk} from '~/redux/create.app.async.thunk';

export const getRetailerCreditCardsThunk = createAppAsyncThunk(
  'retailer/getCreditCards',
  async (args: {retailerId: number}) => {
    const cardsResponse = await apiClient.getRetailerCreditCards(args);

    return cardsResponse.creditCards;
  },
);
