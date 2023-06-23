import {faker} from '@faker-js/faker';
import {screen, render, within, fireEvent} from '@testing-library/react-native';
import {TransactionListItemPresenter} from '~/Transaction/components';
import {TransactionListItem} from '~/domain';
import {MD3Colors} from 'react-native-paper';

const item: TransactionListItem = {
  id: faker.number.int(),
  amount: faker.number.float().toPrecision(2),
  createDate: faker.date.recent().toString(),
  retailerFirstName: faker.person.firstName(),
  retailerLastName: faker.person.lastName(),
  status: faker.helpers.arrayElement(['PENDING', 'FINISHED', 'REJECTED']),
  updateDate: faker.date.recent().toString(),
};

describe('transaction list item presenter tests', () => {
  it('should show retailer first and last name', () => {
    render(<TransactionListItemPresenter index={0} item={item} />);

    expect(
      screen.getByText(`${item.retailerFirstName} ${item.retailerLastName}`),
    ).toBeVisible();
  });

  it('should show correct transaction amount', () => {
    render(<TransactionListItemPresenter index={0} item={item} />);

    expect(screen.getByText(`${item.amount} USD`)).toBeVisible();
  });

  it('should show transaction create date', () => {
    const createDate = new Date(item.createDate);
    const year = createDate.getFullYear(),
      month = createDate.getMonth() + 1,
      day = createDate.getDate(),
      hours = createDate.getHours(),
      minutes = createDate.getMinutes();
    const addZero = (v: number) => String(v).padStart(2, '0');

    render(<TransactionListItemPresenter index={0} item={item} />);

    expect(
      screen.getByText(
        `${addZero(day)}.${addZero(month)}.${year}/${addZero(hours)}:${addZero(
          minutes,
        )}`,
      ),
    ).toBeVisible();
  });

  it('should call onOptions callback', () => {
    const callback = jest.fn();
    const index = faker.number.int();
    const targetItem: TransactionListItem = {...item, status: 'PENDING'};
    render(
      <TransactionListItemPresenter
        index={index}
        item={targetItem}
        onOptions={callback}
      />,
    );

    const pressable = within(
      screen.getByTestId(`TransactionListItem_${item.id}`),
    ).getByTestId('Pressable');
    fireEvent.press(pressable);

    expect(callback).toHaveBeenCalledWith(targetItem, index);
  });

  it('should render status presenter with correct text and color', () => {
    const suites = [
      ['PENDING', 'transactions.pending', MD3Colors.primary90],
      ['FINISHED', 'transactions.finished', MD3Colors.secondary90],
      ['REJECTED', 'transactions.rejected', MD3Colors.error40],
    ] as const;

    for (let [status, statusText] of suites) {
      render(
        <TransactionListItemPresenter index={0} item={{...item, status}} />,
      );

      expect(screen.getByText(statusText)).toBeVisible();
      const chip = within(
        screen.getByTestId(`TransactionListItem_${item.id}`),
      ).getByTestId('StatusChip-container');
      expect(chip).toHaveStyle({borderRadius: 8});
    }
  });
});
