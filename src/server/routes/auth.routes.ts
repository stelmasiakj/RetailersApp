import {Server} from 'miragejs';
import {faker} from '@faker-js/faker';

export function authRoutes(server: Server) {
  server.post('/login', () => {
    return {token: faker.string.uuid()};
  });
}
