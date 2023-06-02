import {RestSerializer, createServer} from 'miragejs';
import {models} from './models';
import {routes} from './routes';
import {factories} from './factories';
import {Config} from '~/config';
import {faker} from '@faker-js/faker';

export function createMirage() {
  const server = createServer({
    models,
    factories,
    seeds(_server) {
      _server.create('user');

      for (let i = 0; i < faker.number.int({min: 50, max: 100}); i++) {
        const retailer = _server.create('retailer');
        _server.createList('creditCard', faker.number.int({min: 2, max: 4}), {
          retailer,
        });
        _server.createList('transaction', faker.number.int({min: 1, max: 3}), {
          retailer,
        });
      }
    },
    serializers: {
      application: RestSerializer,
    },
  });

  server.logging = true;
  server.timing = 500;
  server.namespace = 'api';
  server.urlPrefix = Config.APP_API_URL;

  for (const namespace of Object.keys(routes)) {
    routes[namespace as keyof typeof routes](server);
  }

  return server;
}

export const startMirage = () => {
  if ((global as any).server) {
    (global as any).server.shutdown();
  }
  (global as any).server = createMirage();
};
