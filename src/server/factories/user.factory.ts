import {faker} from '@faker-js/faker';
import {Factory} from 'miragejs';
import {User} from '~/domain';
export const userFactory = Factory.extend<User>({
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
        typeof this.firstName === 'string' ? this.firstName : this.firstName(i),
      lastName:
        typeof this.lastName === 'string' ? this.lastName : this.lastName(i),
    });
  },
});
