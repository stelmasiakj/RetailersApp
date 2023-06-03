import {Mask} from '~/utils';

export const INPUT_ACCESSORY_ID = 'AddCreditCardInputAccessory';

export const CARD_NUMBER_MASK = new Mask('9999 9999 9999 9999');
export const EXPIRATION_MASK = new Mask('99/99');
export const CV2_MASK = new Mask('999');
