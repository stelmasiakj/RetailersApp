import {fakeDB} from './fake.db';
import {fakeServer} from './fake.server';
fakeDB.reload();
fakeServer.startListening();
