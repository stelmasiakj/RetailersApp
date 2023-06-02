import {faker} from '@faker-js/faker';
import {Factory} from 'miragejs';
import {Transaction} from '~/domain';
export const transactionFactory = Factory.extend<Partial<Transaction>>({
  id(i) {
    return i;
  },
  amount() {
    return faker.number.int({min: 2000, max: 5000}).toString();
  },
  createDate() {
    return faker.date.past({years: 1}).toString();
  },
  status() {
    return faker.helpers.arrayElement([
      'PENDING',
      'PENDING',
      'REJECTED',
      'FINISHED',
      'FINISHED',
      'FINISHED',
      'FINISHED',
      'FINISHED',
      'FINISHED',
      'FINISHED',
    ]);
  },

  updateDate(i) {
    const status =
      (typeof this.status === 'string'
        ? this.status
        : typeof this.status === 'function'
        ? this.status(i)
        : 'PENDING') || 'PENDING';
    if (status === 'PENDING') {
      return '';
    }

    const createDate =
      (typeof this.createDate === 'string'
        ? this.createDate
        : typeof this.createDate === 'function'
        ? this.createDate(i)
        : faker.date.recent().toString()) || faker.date.recent().toString();
    const updateDate = new Date(createDate);
    updateDate.setDate(updateDate.getDate() + 1);

    return updateDate.toString();
  },
});
