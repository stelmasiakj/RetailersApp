import {RestSerializer, createServer} from 'miragejs';
import {models} from './models';
import {routes} from './routes';
import {factories} from './factories';
import {Config} from '~/config';
import {faker} from '@faker-js/faker';

export function createMirage() {
  const server = createServer({
    urlPrefix: Config.APP_API_URL,
    namespace: 'api',
    timing: 500,
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
    routes() {
      for (const namespace of Object.keys(routes)) {
        routes[namespace as keyof typeof routes](this);
      }
    },
  });

  return server;
}

export const startMirage = () => {
  if ((global as any).server) {
    (global as any).server.shutdown();
  }
  (global as any).server = createMirage();
};
