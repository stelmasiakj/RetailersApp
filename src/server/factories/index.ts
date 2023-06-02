import {creditCardFactory} from './credit.card.factory';
import {retailerFactory} from './retailer.factory';
import {transactionFactory} from './transaction.factory';
import {userFactory} from './user.factory';

export const factories = {
  user: userFactory,
  creditCard: creditCardFactory,
  retailer: retailerFactory,
  transaction: transactionFactory,
};
