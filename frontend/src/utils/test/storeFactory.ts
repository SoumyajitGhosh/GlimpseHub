import { configureStore } from "@reduxjs/toolkit";

import rootReducer from "../../redux/rootReducer";
import type { RootState } from "../../redux/store";

/**
 * Create a Redux store for tests, seeded with an optional initial state.
 * The dev-only serializable/immutable checks are disabled so tests can seed
 * whatever shape they need.
 */
export const storeFactory = (preloadedState?: Partial<RootState>) =>
  configureStore({
    reducer: rootReducer,
    preloadedState,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
        immutableCheck: false,
      }),
  });
