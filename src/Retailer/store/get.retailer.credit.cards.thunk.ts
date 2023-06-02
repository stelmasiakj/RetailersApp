import {apiClient} from '~/api';
import {CreditCard} from '~/domain';
import {createAppAsyncThunk} from '~/redux/create.app.async.thunk';

export const getRetailerCreditCardsThunk = createAppAsyncThunk(
  'retailer/getCreditCards',
  async ({retailerId}: {retailerId: number}) => {
    const cardsResponse = (
      await apiClient.get(`/api/creditcards/${retailerId}`)
    ).data as {creditCards: CreditCard[]};
    return cardsResponse.creditCards;
  },
);
