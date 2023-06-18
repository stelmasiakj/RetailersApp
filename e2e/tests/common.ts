import {faker} from '@faker-js/faker';
import {by, expect, element} from 'detox';
import {fakeDB} from '../fake.db';

export const login = async () => {
  const email = faker.internet.email();
  const password = faker.string.alphanumeric({length: 8});

  await element(by.id('UserNameInput')).typeText(email);
  await element(by.id('PasswordInput')).typeText(password);
  await element(by.text('Done')).tap();
  await element(by.id('LoginSubmitButton')).tap();
};

export const goToTab = async (tab: 'Retailer' | 'Transactions' | 'Profile') => {
  await element(by.id(`TabBar_${tab}`)).tap();
};

export const expectElementToBeVisibleById = async (id: string) => {
  await expect(element(by.id(id))).toBeVisible();
};

export const expectElementToBeVisibleByText = async (text: string) => {
  await expect(element(by.text(text))).toBeVisible();
};

export const tapElementWithText = async (text: string) => {
  await element(by.text(text)).tap();
};

export const tapElementWithId = async (id: string) => {
  await element(by.id(id)).tap();
};

export const getRetailers = () => {
  return fakeDB.data.retailers.sort((r1, r2) => {
    const fullName1 = `${r1.firstName} ${r1.lastName}`.toLowerCase();
    const fullName2 = `${r2.firstName} ${r2.lastName}`.toLowerCase();

    return fullName1 > fullName2 ? 1 : fullName1 < fullName2 ? -1 : 0;
  });
};

export const getTransactions = ({type}: {type: 'ACTIVE' | 'FINISHED'}) => {
  return fakeDB.data.transactions
    .filter(t =>
      type === 'FINISHED' ? t.status === 'FINISHED' : t.status !== 'FINISHED',
    )
    .sort((t1, t2) => {
      const createDate1 = new Date(t1.createDate);
      const createDate2 = new Date(t2.createDate);

      return createDate2.getTime() - createDate1.getTime();
    });
};

export const formatDate = (v: Date | string) => {
  const date = new Date(v);
  if (isNaN(date as any)) {
    return '';
  }

  const year = date.getFullYear(),
    month = date.getMonth() + 1,
    day = date.getDate();

  return `${String(day).padStart(2, '0')}.${String(month).padStart(
    2,
    '0',
  )}.${year}`;
};
