import {
  useDispatch,
  useSelector,
  type TypedUseSelectorHook,
} from "react-redux";
import type { Action, ThunkAction } from "@reduxjs/toolkit";

import type { AppDispatch, RootState } from "./store";

/** Typed `useDispatch` — knows about thunks. */
export const useAppDispatch: () => AppDispatch = useDispatch;

/** Typed `useSelector` — `state` is `RootState`. */
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

/** Return type for the hand-rolled `() => (dispatch, getState) => {}` thunks. */
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action
>;
