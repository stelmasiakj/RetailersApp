import {Server} from 'miragejs';
import {AppSchema} from '../types';

export function creditCardRoutes(server: Server) {
  server.get('/creditcards/:userId', (schema: AppSchema, request) => {
    const {userId} = request.params;
    const retailer = schema.find('retailer', userId);
    if (!retailer) {
      throw new Error('user not found');
    }
    return retailer.creditCards;
  });

  server.post('/creditcard', (schema: AppSchema, request) => {
    const body = JSON.parse(request.requestBody);
    const cv2: string = body.cv2;
    const cardNumber: string = body.cardNumber;
    const ownerId: string = body.ownerId;
    const expires: string = body.expires;

    const retailer = schema.find('retailer', ownerId);
    if (!retailer) {
      throw new Error('user not found');
    }

    const card = schema.create('creditCard', {
      cv2,
      lastFourDigits: cardNumber.slice(cardNumber.length - 4),
      expires,
      retailer,
    });

    return card;
  });

  server.delete('/creditcard/:id', (schema: AppSchema, request) => {
    const {id} = request.params;
    const card = schema.find('creditCard', id);
    if (!card) {
      throw new Error('card not found');
    }

    card.destroy();

    return {deleted: true};
  });
}
