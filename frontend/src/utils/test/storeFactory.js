import { configureStore } from "@reduxjs/toolkit";

import rootReducer from "../../redux/rootReducer";

/**
 * Create a Redux store for tests, seeded with an optional initial state.
 * The dev-only serializable/immutable checks are disabled so tests can seed
 * whatever shape they need.
 * @function storeFactory
 * @param {object} [preloadedState] Initial state for the store.
 * @returns {import("@reduxjs/toolkit").EnhancedStore} Redux store
 */
export const storeFactory = (preloadedState) =>
  configureStore({
    reducer: rootReducer,
    preloadedState,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
        immutableCheck: false,
      }),
  });
