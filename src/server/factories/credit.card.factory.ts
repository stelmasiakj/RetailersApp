import {faker} from '@faker-js/faker';
import {Factory} from 'miragejs';
import {CreditCard} from '~/domain';
export const creditCardFactory = Factory.extend<Partial<CreditCard>>({
  id(i) {
    return i;
  },
  cv2() {
    return faker.string.numeric(4);
  },
  expires() {
    const date = faker.date.future({years: 5});
    return `${String(date.getMonth() + 1).padStart(2, '0')}/${date
      .getFullYear()
      .toString()
      .substring(2)}`;
  },
  lastFourDigits() {
    return faker.string.numeric(4);
  },
});
