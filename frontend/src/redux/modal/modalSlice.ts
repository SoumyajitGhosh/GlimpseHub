import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface ModalEntry {
  props: Record<string, unknown>;
  component: string;
}

export interface ModalState {
  modals: ModalEntry[];
}

const initialState: ModalState = { modals: [] };

/**
 * Modal stack. `props` can carry React elements and callbacks (render props),
 * so this slice is intentionally exempt from the serializable-state check
 * (see store.js).
 */
const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    /**
     * Shows the Modal component with a specified child and props.
     */
    showModal: {
      reducer(state, action: PayloadAction<ModalEntry>) {
        state.modals.push(action.payload);
      },
      prepare(props: Record<string, unknown>, component: string) {
        return { payload: { props, component } };
      },
    },
    /** Hides a shown Modal (matched by component path). */
    hideModal(state, action: PayloadAction<string>) {
      state.modals = state.modals.filter(
        (modal) => modal.component !== action.payload
      );
    },
  },
});

export const { showModal, hideModal } = modalSlice.actions;
export default modalSlice.reducer;
