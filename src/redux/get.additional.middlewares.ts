import {Middleware} from '@reduxjs/toolkit';

const shouldUseFlipper = () => {
  const isDevelopmentMode = __DEV__;
  const isTesting = !!process.env.JEST_WORKER_ID;

  return isDevelopmentMode && !isTesting;
};

const createFlipperMiddleware = () => {
  const createDebugger = require('redux-flipper').default;
  return createDebugger();
};

export const getAdditionalMiddlewares = () => {
  const middlewares: Middleware[] = [];

  if (shouldUseFlipper()) {
    const flipperMiddleware = createFlipperMiddleware();
    middlewares.push(flipperMiddleware);
  }

  return middlewares;
};
