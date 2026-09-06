import { createSlice } from "@reduxjs/toolkit";

/**
 * Global toast alert. `onClick` holds a callback, so this slice is exempt from
 * the serializable-state check (see store.js).
 */
const alertSlice = createSlice({
  name: "alert",
  initialState: {
    text: "",
    onClick: null,
    showAlert: false,
    timeoutId: null,
  },
  reducers: {
    showAlertAction: {
      reducer(state, action) {
        state.text = action.payload.text;
        state.onClick = action.payload.onClick;
        state.showAlert = true;
      },
      prepare(text, onClick = null) {
        return { payload: { text, onClick } };
      },
    },
    hideAlert(state) {
      state.text = "";
      state.onClick = null;
      state.showAlert = false;
    },
    setAlertTimeoutId(state, action) {
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
 * @param {string} text
 * @param {Function} [onClick]
 */
export const showAlert =
  (text, onClick = null) =>
  (dispatch, getState) => {
    const state = getState();
    clearTimeout(state.alert.timeoutId);

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
