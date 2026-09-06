import { describe, it, expect } from "vitest";

import reducer, {
  setChatUserAction,
  addSocketMessagesAction,
} from "./chatSlice";
import { INITIAL_STATE } from "./chatSlice";

describe("chatSlice", () => {
  it("setChatUser resolves the user from loaded data", () => {
    const state = {
      ...INITIAL_STATE,
      data: [{ _id: "u1", username: "a" }, { _id: "u2" }],
    };
    expect(reducer(state, setChatUserAction("u1")).chatUser).toEqual({
      _id: "u1",
      username: "a",
    });
  });

  it("pushMessageSuccess (via the socket echo) appends and clears the sending flag", () => {
    // addSocketMessagesAction is a thunk; capture what it dispatches
    let dispatched;
    addSocketMessagesAction({ _id: "m1", message: "hi" })((a) => {
      dispatched = a;
    });
    const state = reducer(
      { ...INITIAL_STATE, messageSending: true, messages: [] },
      dispatched
    );
    expect(state.messages).toEqual([{ _id: "m1", message: "hi" }]);
    expect(state.messageSending).toBe(false);
  });

  it("fetchAllMessages de-duplicates by _id", () => {
    const seeded = reducer(
      { ...INITIAL_STATE, messages: [] },
      { type: "chat/fetchAllMessages", payload: [{ _id: "m1" }, { _id: "m2" }] }
    );
    const next = reducer(seeded, {
      type: "chat/fetchAllMessages",
      payload: [{ _id: "m2" }, { _id: "m3" }],
    });
    expect(next.messages.map((m) => m._id)).toEqual(["m1", "m2", "m3"]);
  });
});
