import {faker} from '@faker-js/faker';
import {by, expect, element} from 'detox';
import {
  expectElementToBeVisibleByText,
  getRetailers,
  login,
  tapElementWithText,
} from './common';
import {fakeDB} from '../fake.db';

describe('credit cards e2e tests', () => {
  let retailer: ReturnType<typeof getRetailers>[number];

  beforeEach(async () => {
    retailer = getRetailers()[0];
    await login();
    await tapElementWithText(`${retailer.firstName} ${retailer.lastName}`);
    await element(by.text('Credit cards')).atIndex(0).tap();
  });

  it('should see retailer credit cards on retailer details screen', async () => {
    const cards = fakeDB.data.creditCards.filter(card =>
      retailer.creditCardIds.includes(card.id),
    );

    for (const card of cards) {
      await expectElementToBeVisibleByText(
        `•••• •••• •••• ${card.lastFourDigits}`,
      );
      await expectElementToBeVisibleByText(card.expires);
    }
  });

  it('should add credit card', async () => {});

  it('should delete credit card', async () => {
    const card = fakeDB.data.creditCards.filter(card =>
      retailer.creditCardIds.includes(card.id),
    )[0];

    await element(by.id(`CreditCardItem_${card.id}`)).swipe('left', 'fast');
    await tapElementWithText('Confirm');

    await element(by.id('CreditCardsTab')).swipe('down', 'fast');
    await expect(element(by.id(`CreditCardItem_${card.id}`))).not.toBeVisible();
  });
});
