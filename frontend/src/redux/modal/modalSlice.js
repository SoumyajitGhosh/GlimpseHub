import { createSlice } from "@reduxjs/toolkit";

/**
 * Modal stack. `props` can carry React elements and callbacks (render props),
 * so this slice is intentionally exempt from the serializable-state check
 * (see store.js).
 */
const modalSlice = createSlice({
  name: "modal",
  initialState: { modals: [] },
  reducers: {
    /**
     * Shows the Modal component with a specified child and props
     * @param {object} props Props to pass to the modal child
     * @param {string} component Path of a component in the components directory
     */
    showModal: {
      reducer(state, action) {
        state.modals.push(action.payload);
      },
      prepare(props, component) {
        return { payload: { props, component } };
      },
    },
    /** Hides a shown Modal (matched by component path) */
    hideModal(state, action) {
      state.modals = state.modals.filter(
        (modal) => modal.component !== action.payload
      );
    },
  },
});

export const { showModal, hideModal } = modalSlice.actions;
export default modalSlice.reducer;
