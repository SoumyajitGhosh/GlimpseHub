import { configureStore } from "@reduxjs/toolkit";
import logger from "redux-logger";

import rootReducer from "./rootReducer";

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => {
    const middleware = getDefaultMiddleware({
      // The socket slice still holds the live socket.io instance in state and
      // dispatches it in the CONNECT action. That moves out of the store in a
      // later Phase 3 commit; until then, exempt it from the dev checks.
      serializableCheck: {
        ignoredActions: ["CONNECT"],
        ignoredPaths: ["socket.socket"],
      },
      immutableCheck: { ignoredPaths: ["socket.socket"] },
    });
    return import.meta.env.DEV ? middleware.concat(logger) : middleware;
  },
  devTools: import.meta.env.DEV,
});

export default store;
