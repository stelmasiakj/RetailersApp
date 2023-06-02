import {CreditCard} from './credit.card';
import {Transaction} from './transaction';

export type Retailer = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  joinDate: string;
  phoneNumber: string;
  avatar: string;
  streetName: string;
  streetNumber: string;
  city: string;

  creditCards: CreditCard[];
  transactions: Transaction[];
};

export type RetailerDetails = Omit<Retailer, 'creditCards' | 'transactions'>;

export type RetailerListItem = Omit<
  Retailer,
  'creditCards' | 'transactions' | 'email' | 'joinDate' | 'phoneNumber'
>;
