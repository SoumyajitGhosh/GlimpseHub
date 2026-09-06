import { configureStore } from "@reduxjs/toolkit";
import logger from "redux-logger";

import rootReducer from "./rootReducer";

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => {
    const middleware = getDefaultMiddleware({
      serializableCheck: {
        // `modal.modals[].props` carries React elements / render props and
        // `alert.onClick` is a callback — non-serializable by design.
        ignoredActions: ["modal/showModal", "alert/showAlertAction"],
        ignoredPaths: ["modal.modals", "alert.onClick"],
      },
    });
    return import.meta.env.DEV ? middleware.concat(logger) : middleware;
  },
  devTools: import.meta.env.DEV,
});

export default store;
