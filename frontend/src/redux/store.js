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
        // `socket.socket` still holds the live io instance (removed from state
        // in a later Phase 3 commit, along with the CONNECT exemption).
        ignoredActions: ["CONNECT", "modal/showModal", "alert/showAlertAction"],
        ignoredPaths: ["socket.socket", "modal.modals", "alert.onClick"],
      },
      immutableCheck: { ignoredPaths: ["socket.socket"] },
    });
    return import.meta.env.DEV ? middleware.concat(logger) : middleware;
  },
  devTools: import.meta.env.DEV,
});

export default store;
