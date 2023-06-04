import {device} from 'detox';

beforeEach(async () => {
  await device.launchApp({delete: true});
  await device.setURLBlacklist(['.*localhost:3000.*']);
});
