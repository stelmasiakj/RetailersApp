import {faker} from '@faker-js/faker';
import {by, expect, element} from 'detox';
import {
  expectElementToBeVisibleByText as expectElementWithTextToBeVisible,
  goToTab,
  login,
  tapElementWithText,
} from './common';

describe('auth e2e tests', () => {
  it('should sign in', async () => {
    const email = faker.internet.email();
    const password = faker.string.alphanumeric({length: 8});

    await element(by.id('UserNameInput')).typeText(email);
    await element(by.id('PasswordInput')).typeText(password);
    await element(by.text('Done')).tap();
    await element(by.id('LoginSubmitButton')).tap();

    await expect(element(by.id('RetailerListScreenContainer'))).toBeVisible();
  });

  it('should logout', async () => {
    await login();
    await goToTab('Profile');
    await tapElementWithText('Log out');

    await expectElementWithTextToBeVisible('Sign in');
  });
});
