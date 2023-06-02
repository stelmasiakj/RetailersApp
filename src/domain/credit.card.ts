import {Retailer} from './retailer';

export type CreditCard = {
  id: number;
  expires: string;
  lastFourNumbers: string;
  cv2: string;
  retailer: Retailer;
};

export type CreditCardListItem = Omit<CreditCard, 'retailer'>;
