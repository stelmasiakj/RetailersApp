import {configureStore} from '@reduxjs/toolkit';
import {getAdditionalMiddlewares} from './get.additional.middlewares';
import {rootReducer} from './root.reducer';

const makeStore = (preloadedState: any = undefined) => {
  return configureStore({
    reducer: rootReducer,
    middleware: getDefaultMiddleware =>
      getDefaultMiddleware().concat(getAdditionalMiddlewares()),
    preloadedState,
  });
};

const store = makeStore();

export {makeStore, store};
