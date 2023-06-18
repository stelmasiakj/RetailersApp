import {faker} from '@faker-js/faker';
import {by, expect, element} from 'detox';
import {
  expectElementToBeVisibleById,
  expectElementToBeVisibleByText,
  getRetailers,
  login,
  tapElementWithText,
  formatDate,
} from './common';

describe('retailers e2e tests', () => {
  it('should see retailers on retailers list screen', async () => {
    const retailers = getRetailers();
    await login();

    for (const retailer of retailers) {
      await waitFor(element(by.id(`RetailerListItem_${retailer.id}`)))
        .toBeVisible(100)
        .whileElement(by.id('RetailerList'))
        .scroll(100, 'down', NaN, 0.8);

      await expect(
        element(
          by
            .text(`${retailer.firstName} ${retailer.lastName}`)
            .withAncestor(by.id(`RetailerListItem_${retailer.id}`)),
        ),
      ).toBeVisible();
    }
  });

  it('should see retailer details on retailers details screen', async () => {
    const retailer = getRetailers()[0];

    await login();
    await tapElementWithText(`${retailer.firstName} ${retailer.lastName}`);

    await validateRetailerDetails(retailer);
  });

  it('should be able to search for retailer', async () => {
    const retailer = faker.helpers.arrayElement(getRetailers());
    const {firstName, lastName} = retailer;

    await login();
    await typeRetailerSearch(`${firstName} ${lastName}`);
    await tapSearchedRetailer({firstName, lastName});

    await validateRetailerDetails(retailer);
  });
});

async function tapSearchedRetailer({
  firstName,
  lastName,
}: {
  firstName: string;
  lastName: string;
}) {
  await element(
    by
      .text(`${firstName} ${lastName}`)
      .withAncestor(by.id('RetailerSearchContent')),
  ).tap();
}

async function typeRetailerSearch(search: string) {
  await element(by.text('Search for retailer')).tap();
  await element(by.id('RetailerSearch')).typeText(search);
}

async function validateRetailerDetails(retailer: {
  city: string;
  streetNumber: string;
  streetName: string;
  phoneNumber: string;
  joinDate: string;
  lastName: string;
  firstName: string;
  email: string;
}) {
  await expectElementToBeVisibleById('RetailerDetailsScreen');
  await expectElementToBeVisibleByText(
    `${retailer.firstName} ${retailer.lastName}`,
  );
  await expectElementToBeVisibleByText(retailer.email);
  await expectElementToBeVisibleByText(
    `${retailer.streetName} ${retailer.streetNumber}, ${retailer.city}`,
  );
  await expectElementToBeVisibleByText(
    `${retailer.phoneNumber.substring(0, 3)} ${retailer.phoneNumber.substring(
      3,
      6,
    )} ${retailer.phoneNumber.substring(6, 9)} ${retailer.phoneNumber.substring(
      9,
      12,
    )}`,
  );
  await expectElementToBeVisibleByText(formatDate(retailer.joinDate));
}
