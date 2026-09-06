import { describe, it, expect } from "vitest";

import reducer from "./socketSlice";

const initial = { connected: false, error: null };

describe("socketSlice", () => {
  it("socketConnected sets connected + clears error", () => {
    const next = reducer(
      { connected: false, error: "boom" },
      { type: "socket/socketConnected" }
    );
    expect(next).toEqual({ connected: true, error: null });
  });

  it("socketDisconnected only flips the flag", () => {
    const next = reducer(
      { connected: true, error: null },
      { type: "socket/socketDisconnected" }
    );
    expect(next.connected).toBe(false);
  });

  it("socketError records the message", () => {
    const next = reducer(initial, {
      type: "socket/socketError",
      payload: "handshake failed",
    });
    expect(next.error).toBe("handshake failed");
  });

  it("state holds no non-serializable socket instance", () => {
    expect(Object.keys(reducer(undefined, { type: "@@INIT" }))).toEqual([
      "connected",
      "error",
    ]);
  });
});
