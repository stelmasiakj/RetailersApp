import {Model, belongsTo} from 'miragejs';
import {ModelDefinition} from 'miragejs/-types';
import {Transaction} from '~/domain';

export const TransactionModel: ModelDefinition<Transaction> = Model.extend({
  retailer: belongsTo(),
});
