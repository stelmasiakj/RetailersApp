import {Model, belongsTo} from 'miragejs';
import {ModelDefinition} from 'miragejs/-types';
import {CreditCard} from '~/domain';

export const CreditCardModel: ModelDefinition<CreditCard> = Model.extend({
  retailer: belongsTo(),
});
