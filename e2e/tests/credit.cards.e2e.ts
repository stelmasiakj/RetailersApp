import {faker} from '@faker-js/faker';
import {by, expect, element} from 'detox';
import {
  expectElementToBeVisibleByText,
  getRetailers,
  login,
  tapElementWithId,
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

  it('should add credit card', async () => {
    const cardNumber = '1111 2222 3333 4444';
    const expiration = faker.phone.number('##/##');
    const cv2 = faker.phone.number('###');

    await tapElementWithId('AddCreditCardButton');

    await fillAndSubmitCreditCard(cardNumber, expiration, cv2);
    await pass3DS();
    await waitFor(element(by.text('Credit card has been added')))
      .toBeVisible()
      .withTimeout(20000);
    await tapElementWithText('Back');

    await expectElementToBeVisibleByText(
      `•••• •••• •••• ${cardNumber.slice(cardNumber.length - 4)}`,
    );
    await expectElementToBeVisibleByText(expiration);
  });

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

async function fillAndSubmitCreditCard(
  cardNumber: string,
  expiration: string,
  cv2: string,
) {
  await element(by.id('CreditCardNumber')).typeText(cardNumber);

  await element(by.id('CreditCardExpiration')).replaceText(expiration);
  await element(by.id('CreditCardCV2')).typeText(cv2);

  await tapElementWithText('Done');
  await element(by.id('AcceptRegulationsSwitch')).tap();
  await tapElementWithText('Save credit card');
}

async function pass3DS() {
  await waitFor(element(by.text('Sample 3DS View. Click continue to add card')))
    .toBeVisible()
    .withTimeout(5000);
  await tapElementWithText('CONTINUE');
}
