import {authRoutes} from './auth.routes';
import {creditCardRoutes} from './credit.card.routes';
import {retailerRoutes} from './retailer.routes';
import {transactionRoutes} from './transaction.routes';
import {userRoutes} from './user.routes';

export const routes = {
  users: userRoutes,
  auth: authRoutes,
  retailer: retailerRoutes,
  creditCards: creditCardRoutes,
  transaction: transactionRoutes,
};
