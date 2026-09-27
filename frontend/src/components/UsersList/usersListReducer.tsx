import type { User } from "../../types";

export interface UsersListState {
  fetching: boolean;
  fetchingAdditional: boolean;
  error: unknown;
  data: User[] | null;
}

export type UsersListAction =
  | { type: "FETCH_START" }
  | { type: "FETCH_ADDITIONAL_START" }
  | { type: "FETCH_FAILURE"; payload: unknown }
  | { type: "FETCH_SUCCESS"; payload: User[] }
  | { type: "ADD_USERS"; payload: User[] };

export const INITIAL_STATE: UsersListState = {
  fetching: true,
  fetchingAdditional: false,
  error: false,
  data: null,
};

export const usersListReducer = (
  state: UsersListState,
  action: UsersListAction
): UsersListState => {
  switch (action.type) {
    case "FETCH_START": {
      return { ...state, fetching: true, error: false };
    }
    case "FETCH_ADDITIONAL_START": {
      return {
        ...state,
        fetching: false,
        error: false,
        fetchingAdditional: true,
      };
    }
    case "FETCH_FAILURE": {
      return {
        ...state,
        fetching: false,
        fetchingAdditional: false,
        error: action.payload,
      };
    }
    case "FETCH_SUCCESS": {
      return {
        ...state,
        fetching: false,
        fetchingAdditional: false,
        error: false,
        data: action.payload,
      };
    }
    case "ADD_USERS": {
      return {
        ...state,
        fetchingAdditional: false,
        data: [...(state.data ?? []), ...action.payload],
      };
    }
    default: {
      throw new Error(
        `Invalid action type passed to usersListReducer`
      );
    }
  }
};
