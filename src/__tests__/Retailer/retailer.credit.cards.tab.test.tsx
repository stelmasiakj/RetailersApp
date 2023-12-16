import {faker} from '@faker-js/faker';
import {useRoute} from '@react-navigation/native';
import {
  render,
  waitFor,
  within,
  screen,
  waitForElementToBeRemoved,
} from '@testing-library/react-native';
import React from 'react';
import {Provider} from 'react-redux';
import {RetailerCreditCardsTab} from '~/Retailer/screens/retailer-details/tabs';
import {apiClient} from '~/api';
import {CreditCard} from '~/domain';
import {makeStore} from '~/redux/store';
import {PortalProvider} from '@gorhom/portal';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

const creditCards = (() => {
  return Array.from(Array(5).keys()).map<CreditCard>(id => {
    const date = faker.date.future({years: 5});
    return {
      id,
      cv2: faker.string.numeric(3),
      expires: `${String(date.getMonth() + 1).padStart(2, '0')}/${date
        .getFullYear()
        .toString()
        .substring(2)}`,
      lastFourDigits: faker.string.numeric(4),
      retailer: null as any,
    };
  });
})();

jest.mock('@react-navigation/native');

const retailerId = faker.number.int();

beforeEach(() => {
  (useRoute as jest.MockedFunction<typeof useRoute>).mockReturnValue({
    key: 'key',
    name: 'name',
    params: {id: retailerId},
  });
});

test('should show retailer credit cards', async () => {
  jest
    .spyOn(apiClient, 'getRetailerCreditCards')
    .mockResolvedValue({creditCards});

  render(
    <GestureHandlerRootView>
      <Provider store={makeStore()}>
        <PortalProvider>
          <RetailerCreditCardsTab />
        </PortalProvider>
      </Provider>
    </GestureHandlerRootView>,
  );

  await waitFor(() => {
    for (const creditCard of creditCards) {
      expect(
        within(screen.getByTestId(`CreditCardItem_${creditCard.id}`)).getByText(
          `•••• •••• •••• ${creditCard.lastFourDigits}`,
        ),
      ).toBeVisible();
      expect(
        within(screen.getByTestId(`CreditCardItem_${creditCard.id}`)).getByText(
          creditCard.expires,
        ),
      ).toBeVisible();
    }
  });
});

test('should call proper backen method while fetching retailer credit cards', async () => {
  const getCreditCardsSpy = jest
    .spyOn(apiClient, 'getRetailerCreditCards')
    .mockResolvedValue({creditCards});

  render(
    <GestureHandlerRootView>
      <Provider store={makeStore()}>
        <PortalProvider>
          <RetailerCreditCardsTab />
        </PortalProvider>
      </Provider>
    </GestureHandlerRootView>,
  );

  await waitFor(() => {
    expect(getCreditCardsSpy).toHaveBeenCalledWith({retailerId});
  });
});

test('should show spinner when fetching and hide it when fetch is done', async () => {
  jest.spyOn(apiClient, 'getRetailerCreditCards').mockImplementation(
    () =>
      new Promise(resolve => {
        setTimeout(() => {
          resolve({creditCards});
        }, 200);
      }),
  );

  render(
    <GestureHandlerRootView>
      <Provider store={makeStore()}>
        <PortalProvider>
          <RetailerCreditCardsTab />
        </PortalProvider>
      </Provider>
    </GestureHandlerRootView>,
  );

  await waitFor(() => {
    expect(
      screen.getByTestId('RetailerCreditCardsTabActivityIndicator'),
    ).toBeVisible();
  });
  await waitForElementToBeRemoved(() =>
    screen.queryByTestId('RetailerCreditCardsTabActivityIndicator'),
  );
});

test('should show error view when fetching of retailer credit cards failed', async () => {
  jest.spyOn(apiClient, 'getRetailerCreditCards').mockRejectedValue({});

  render(
    <GestureHandlerRootView>
      <Provider store={makeStore()}>
        <PortalProvider>
          <RetailerCreditCardsTab />
        </PortalProvider>
      </Provider>
    </GestureHandlerRootView>,
  );

  await waitFor(() =>
    expect(screen.getByText('errors.errorOccured')).toBeVisible(),
  );
});
