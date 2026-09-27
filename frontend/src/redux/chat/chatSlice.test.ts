import { describe, it, expect } from "vitest";

import reducer, {
  setChatUserAction,
  addSocketMessagesAction,
  INITIAL_STATE,
  type ChatState,
} from "./chatSlice";
import type { ChatUser, Message } from "../../types";
import type { AppDispatch } from "../store";

const chatUser = (o: Partial<ChatUser>) => o as unknown as ChatUser;
const message = (o: Partial<Message>) => o as unknown as Message;
const st = (o: Partial<ChatState>): ChatState => ({ ...INITIAL_STATE, ...o });

describe("chatSlice", () => {
  it("setChatUser resolves the user from loaded data", () => {
    const state = st({
      data: [chatUser({ _id: "u1", username: "a" }), chatUser({ _id: "u2" })],
    });
    expect(reducer(state, setChatUserAction("u1")).chatUser).toEqual({
      _id: "u1",
      username: "a",
    });
  });

  it("pushMessageSuccess (via the socket echo) appends and clears the sending flag", () => {
    // addSocketMessagesAction is a thunk; capture what it dispatches
    let dispatched: unknown;
    addSocketMessagesAction(message({ _id: "m1", message: "hi" }))(((a: unknown) => {
      dispatched = a;
    }) as unknown as AppDispatch);
    const state = reducer(
      st({ messageSending: true, messages: [] }),
      dispatched as Parameters<typeof reducer>[1]
    );
    expect(state.messages).toEqual([{ _id: "m1", message: "hi" }]);
    expect(state.messageSending).toBe(false);
  });

  it("fetchAllMessages de-duplicates by _id", () => {
    const seeded = reducer(st({ messages: [] }), {
      type: "chat/fetchAllMessages",
      payload: [message({ _id: "m1" }), message({ _id: "m2" })],
    });
    const next = reducer(seeded, {
      type: "chat/fetchAllMessages",
      payload: [message({ _id: "m2" }), message({ _id: "m3" })],
    });
    expect(next.messages.map((m) => m._id)).toEqual(["m1", "m2", "m3"]);
  });
});
