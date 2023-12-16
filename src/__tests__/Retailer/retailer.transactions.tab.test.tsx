import {faker} from '@faker-js/faker';
import {render, screen, waitFor, within} from '@testing-library/react-native';
import {Provider} from 'react-redux';
import {RetailerTransactionsTab} from '~/Retailer/screens/retailer-details/tabs';
import {apiClient} from '~/api';
import {TransactionListItem} from '~/domain';
import {makeStore} from '~/redux/store';
import {useRoute} from '@react-navigation/native';
import {PortalProvider} from '@gorhom/portal';

const transactions = (() => {
  const retailerFirstName = faker.person.firstName(),
    retailerLastName = faker.person.lastName();
  return Array.from(Array(10).keys()).map<TransactionListItem>(id => ({
    id,
    retailerFirstName,
    retailerLastName,
    amount: faker.number.int({min: 1000, max: 5000}).toString(),
    status: faker.helpers.arrayElement(['FINISHED', 'PENDING', 'REJECTED']),
    createDate: faker.date.recent().toString(),
    updateDate: faker.date.recent().toString(),
  }));
})();
const retailerId = faker.number.int();

const formatDate = (v: string) => {
  const createDate = new Date(v);
  const year = createDate.getFullYear(),
    month = createDate.getMonth() + 1,
    day = createDate.getDate(),
    hours = createDate.getHours(),
    minutes = createDate.getMinutes();
  const addZero = (v: number) => String(v).padStart(2, '0');
  return `${addZero(day)}.${addZero(month)}.${year}/${addZero(hours)}:${addZero(
    minutes,
  )}`;
};

const statusTextMap = {
  PENDING: 'transactions.pending',
  FINISHED: 'transactions.finished',
  REJECTED: 'transactions.rejected',
};

jest.mock('@react-navigation/native');

beforeEach(() => {
  (useRoute as jest.MockedFunction<typeof useRoute>).mockReturnValue({
    key: 'key',
    name: 'name',
    params: {id: retailerId},
  });
});

test('should show retailer transactions', async () => {
  jest
    .spyOn(apiClient, 'getRetailerTransactions')
    .mockResolvedValueOnce({total: transactions.length, transactions});

  render(
    <Provider store={makeStore()}>
      <PortalProvider>
        <RetailerTransactionsTab />
      </PortalProvider>
    </Provider>,
  );

  await waitFor(() => {
    for (const transaction of transactions) {
      expect(
        within(
          screen.getByTestId(`TransactionListItem_${transaction.id}`),
        ).getByText(`${transaction.amount} USD`),
      ).toBeVisible();
      expect(
        within(
          screen.getByTestId(`TransactionListItem_${transaction.id}`),
        ).getByText(statusTextMap[transaction.status]),
      ).toBeVisible();
      expect(
        within(
          screen.getByTestId(`TransactionListItem_${transaction.id}`),
        ).getByText(formatDate(transaction.createDate)),
      ).toBeVisible();
    }
  });
});

test('should call proper backend method for fetching retailer transactions', async () => {
  const getTransactionsSpy = jest
    .spyOn(apiClient, 'getRetailerTransactions')
    .mockResolvedValueOnce({total: transactions.length, transactions});

  render(
    <Provider store={makeStore()}>
      <PortalProvider>
        <RetailerTransactionsTab />
      </PortalProvider>
    </Provider>,
  );

  await waitFor(() => {
    expect(getTransactionsSpy).toBeCalledWith({retailerId});
  });
});

test('should show error view if retailer transaction fetch failed', async () => {
  jest.spyOn(apiClient, 'getRetailerTransactions').mockRejectedValueOnce({});

  render(
    <Provider store={makeStore()}>
      <PortalProvider>
        <RetailerTransactionsTab />
      </PortalProvider>
    </Provider>,
  );

  await waitFor(() =>
    expect(screen.getByText('errors.errorOccured')).toBeVisible(),
  );
});
