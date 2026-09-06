import { legacy_createStore as createStore, applyMiddleware } from 'redux';
import logger from 'redux-logger';
import { thunk } from 'redux-thunk';

import rootReducer from './rootReducer';

export const middlewares = [thunk];
if (import.meta.env.DEV) {
    middlewares.push(logger);
}

const store = createStore(rootReducer, applyMiddleware(...middlewares));

export default store;