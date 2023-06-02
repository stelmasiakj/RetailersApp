import {Model, hasMany} from 'miragejs';
import {ModelDefinition} from 'miragejs/-types';
import {Retailer} from '~/domain';

export const RetailerModel: ModelDefinition<Retailer> = Model.extend({
  creditCards: hasMany(),
  transactions: hasMany(),
});
