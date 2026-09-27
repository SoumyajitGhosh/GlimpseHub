import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import type { AppDispatch, RootState } from "../store";

export type AlertClickHandler = (() => void) | null;

export interface AlertState {
  text: string;
  onClick: AlertClickHandler;
  showAlert: boolean;
  timeoutId: ReturnType<typeof setTimeout> | null;
}

const initialState: AlertState = {
  text: "",
  onClick: null,
  showAlert: false,
  timeoutId: null,
};

/**
 * Global toast alert. `onClick` holds a callback, so this slice is exempt from
 * the serializable-state check (see store.js).
 */
const alertSlice = createSlice({
  name: "alert",
  initialState,
  reducers: {
    showAlertAction: {
      reducer(
        state,
        action: PayloadAction<{ text: string; onClick: AlertClickHandler }>
      ) {
        state.text = action.payload.text;
        state.onClick = action.payload.onClick;
        state.showAlert = true;
      },
      prepare(text: string, onClick: AlertClickHandler = null) {
        return { payload: { text, onClick } };
      },
    },
    hideAlert(state) {
      state.text = "";
      state.onClick = null;
      state.showAlert = false;
    },
    setAlertTimeoutId(
      state,
      action: PayloadAction<ReturnType<typeof setTimeout> | null>
    ) {
      state.timeoutId = action.payload;
    },
  },
});

export const { hideAlert, setAlertTimeoutId } = alertSlice.actions;
const { showAlertAction } = alertSlice.actions;

/**
 * Shows an alert with the given text, auto-hiding after 5s. If an alert is
 * already visible it is hidden first so its leave animation can finish before
 * the new one appears.
 */
export const showAlert =
  (text: string, onClick: AlertClickHandler = null) =>
  (dispatch: AppDispatch, getState: () => RootState) => {
    const state = getState();
    if (state.alert.timeoutId) clearTimeout(state.alert.timeoutId);

    const timeout = setTimeout(() => {
      dispatch(hideAlert());
      dispatch(setAlertTimeoutId(null));
    }, 5000);
    dispatch(setAlertTimeoutId(timeout));

    if (state.alert.showAlert) {
      dispatch(hideAlert());
      setTimeout(() => dispatch(showAlertAction(text, onClick)), 500);
    } else {
      dispatch(showAlertAction(text, onClick));
    }
  };

export default alertSlice.reducer;
