import {by, expect, element} from 'detox';
import {getTransactions, goToTab, login} from './common';
import {fakeDB} from '../fake.db';
import {formatDatetime} from '../../src/utils/format.utils';

describe('transactions e2e tests', () => {
  beforeEach(async () => {
    await login();
    await goToTab('Transactions');
  });

  it('should see active transactions', async () => {
    await transactionListTestCore('ACTIVE');
  });

  it('should see finished transactions', async () => {
    await element(by.text('Finished')).atIndex(0).tap();

    await transactionListTestCore('FINISHED');
  });

  it('should filter transactions list', async () => {});
});

async function transactionListTestCore(type: 'ACTIVE' | 'FINISHED') {
  const transactions = getTransactions({type}).slice(0, 10);
  for (const transaction of transactions) {
    await waitFor(element(by.id(`TransactionListItem_${transaction.id}`)))
      .toBeVisible(100)
      .whileElement(by.id(`TransactionList_${type}`))
      .scroll(300, 'down', NaN, 0.8);

    await validateTransactionListItem(transaction);
  }
}

async function validateTransactionListItem(
  transaction: (typeof fakeDB.data.transactions)[0],
) {
  const retailer = fakeDB.data.retailers.find(
    r => r.id === transaction.retailerId,
  )!;
  const statusText = {
    PENDING: 'Pending',
    FINISHED: 'Finished',
    REJECTED: 'Rejected',
  }[transaction.status]!;

  await expect(
    element(
      by
        .text(`${retailer.firstName} ${retailer.lastName}`)
        .withAncestor(by.id(`TransactionListItem_${transaction.id}`)),
    ),
  ).toBeVisible();
  await expect(
    element(
      by
        .text(`${transaction.amount} USD`)
        .withAncestor(by.id(`TransactionListItem_${transaction.id}`)),
    ),
  ).toBeVisible();
  await expect(
    element(
      by
        .text(statusText)
        .withAncestor(by.id(`TransactionListItem_${transaction.id}`)),
    ),
  ).toBeVisible();
  await expect(
    element(
      by
        .text(formatDatetime(transaction.createDate))
        .withAncestor(by.id(`TransactionListItem_${transaction.id}`)),
    ),
  ).toBeVisible();
}
