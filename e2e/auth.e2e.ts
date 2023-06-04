import {faker} from '@faker-js/faker';
import {by, expect, element, device, waitFor} from 'detox';

describe('auth e2e tests', () => {
  it('should sign in', async () => {
    const email = faker.internet.email();
    const password = faker.string.alphanumeric({length: 8});

    await element(by.id('UserNameInput')).typeText(email);
    await element(by.id('PasswordInput')).typeText(password);
    await element(by.text('Done')).tap();
    await element(by.id('LoginSubmitButton')).tap();

    await waitFor(element(by.id('RetailerListScreenContainer')))
      .toBeVisible()
      .withTimeout(10000);
  });
});
