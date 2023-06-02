import {Retailer} from './retailer';

export type Transaction = {
  id: number;
  createDate: string;
  updateDate: string;
  amount: string;
  status: 'PENDING' | 'FINISHED' | 'REJECTED';
  retailer: Retailer;
};

export type TransactionListItem = Omit<Transaction, 'retailer'> & {
  retailerFirstName: string;
  retailerLastName: string;
};
