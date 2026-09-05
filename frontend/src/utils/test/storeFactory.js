import { legacy_createStore as createStore, applyMiddleware } from 'redux';

import rootReducer from '../../redux/rootReducer';
import { middlewares } from '../../redux/store';

/**
 * Create a Redux store for tests, seeded with an optional initial state.
 * @function storeFactory
 * @param {object} [initialState] Initial state for the store.
 * @returns {Store} Redux store
 */
export const storeFactory = initialState => {
  return createStore(
    rootReducer,
    initialState,
    applyMiddleware(...middlewares)
  );
};
