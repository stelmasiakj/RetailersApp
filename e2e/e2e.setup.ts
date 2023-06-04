import {device} from 'detox';
import {fakeServer} from './fake.server';

beforeAll(async () => {
  await fakeServer.startListening();
});

beforeEach(async () => {
  await device.launchApp({delete: true});
});

afterAll(async () => {
  fakeServer.stopListening();
});
