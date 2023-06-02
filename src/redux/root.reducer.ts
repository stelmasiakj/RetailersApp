import {combineReducers} from '@reduxjs/toolkit';
import {retailerReducer} from '~/Retailer/store/retailer.store';
import {transactionReducer} from '~/Transaction/store/transaction.store';
import {authReducer} from '~/Auth/store/auth.store';
import {userReducer} from '~/User/store/user.store';

export const rootReducer = combineReducers({
  auth: authReducer,
  user: userReducer,
  retailer: retailerReducer,
  transaction: transactionReducer,
});
