import {faker} from '@faker-js/faker';
import {Factory} from 'miragejs';
import {Retailer} from '~/domain';

export const retailerFactory = Factory.extend<Partial<Retailer>>({
  id(i) {
    return i;
  },
  firstName() {
    return faker.person.firstName();
  },
  lastName() {
    return faker.person.lastName();
  },
  email(i) {
    return faker.internet.email({
      firstName:
        typeof this.firstName === 'string'
          ? this.firstName
          : typeof this.firstName === 'function'
          ? this.firstName(i)
          : undefined,
      lastName:
        typeof this.lastName === 'string'
          ? this.lastName
          : typeof this.lastName === 'function'
          ? this.lastName(i)
          : undefined,
    });
  },
  avatar: () => {
    return faker.image.avatar();
  },
  joinDate: () => {
    return faker.date.past({years: 2}).toString();
  },
  phoneNumber: () => {
    return faker.phone.number('+48#########');
  },
  streetName: () => {
    return faker.location.street();
  },
  streetNumber: () => {
    return faker.number.int({min: 1, max: 50}).toString();
  },
  city: () => {
    return faker.location.city();
  },
});
