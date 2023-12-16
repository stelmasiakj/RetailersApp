import {useNavigation} from '@react-navigation/native';
import {render} from '@testing-library/react-native';
import {TransactionListScreen} from '~/Transaction';
import {useTransactionsFilter} from '../../Transaction/hooks/transactions.hooks';

jest.mock('react-native-tab-view');
jest.mock('@react-navigation/native');
jest.mock('../../Transaction/hooks/transactions.hooks');

let useNavigationMock: jest.MockedFunction<typeof useNavigation>;
let useTransactionsFilterMock: jest.MockedFunction<
  typeof useTransactionsFilter
>;

beforeEach(() => {
  useNavigationMock = useNavigation as any;
  useTransactionsFilterMock = useTransactionsFilter as any;

  useNavigationMock.mockImplementationOnce(() => ({
    navigate: jest.fn(),
  }));
  useTransactionsFilterMock.mockImplementation(() => ({
    maxStart: null,
    minStart: null,
    retailerIds: null,
  }));
});

test('should render', () => {
  render(<TransactionListScreen />);
});
