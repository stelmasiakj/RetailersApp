import {faker} from '@faker-js/faker';
import {by, expect, element} from 'detox';
import {goToTab, login, tapElementWithText} from './common';
import {fakeDB} from '../fake.db';
import {expectElementToBeVisibleByText} from './common';

describe('profile e2e tests', () => {
  it('should see user info on profile screen', async () => {
    const {firstName, lastName, email} = fakeDB.data.users[0];

    await login();
    await goToTab('Profile');

    await expectElementToBeVisibleByText(
      `${firstName} ${lastName}` + '\n' + email,
    );
  });

  it('should edit profile', async () => {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const email = faker.internet.email({firstName, lastName});

    await login();
    await goToTab('Profile');
    await tapElementWithText('Edit profile');
    await fillProfileForm({firstName, lastName, email});
    await tapElementWithText('Save');

    await expectElementToBeVisibleByText(
      `${firstName} ${lastName}` + '\n' + email,
    );
  });
});

async function fillProfileForm({
  email,
  firstName,
  lastName,
}: {
  firstName: string;
  lastName: string;
  email: string;
}) {
  await element(by.id('ProfileFirstName')).clearText();
  await element(by.id('ProfileLastName')).clearText();
  await element(by.id('ProfileEmail')).clearText();

  await element(by.id('ProfileFirstName')).typeText(firstName);
  await element(by.id('ProfileLastName')).typeText(lastName);
  await element(by.id('ProfileEmail')).typeText(email);
}
