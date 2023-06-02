import {Server} from 'miragejs';
import {AppSchema} from '../types';

export function userRoutes(server: Server) {
  server.get('/profile', (schema: AppSchema) => {
    const user = schema.first('user')!;

    return user;
  });

  server.put('/profile', (schema: AppSchema, request) => {
    const {firstName, lastName, email} = JSON.parse(request.requestBody);
    const user = schema.first('user')!;

    user.update({email, firstName, lastName});

    return {updated: true};
  });
}
