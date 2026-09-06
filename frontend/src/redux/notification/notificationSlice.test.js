import { describe, it, expect } from "vitest";

import reducer, {
  addNotification,
  clearNotifications,
} from "./notificationSlice";

const initial = {
  notifications: [],
  unreadCount: 0,
  fetching: false,
  error: false,
};

describe("notificationSlice", () => {
  it("addNotification prepends and bumps unreadCount", () => {
    const s1 = reducer(initial, addNotification({ _id: "n1" }));
    const s2 = reducer(s1, addNotification({ _id: "n2" }));
    expect(s2.notifications.map((n) => n._id)).toEqual(["n2", "n1"]);
    expect(s2.unreadCount).toBe(2);
  });

  it("clearNotifications resets list and count", () => {
    const seeded = {
      ...initial,
      notifications: [{ _id: "n1" }],
      unreadCount: 1,
    };
    expect(reducer(seeded, clearNotifications())).toEqual(initial);
  });

  it("does not mutate the input state", () => {
    const before = { ...initial, notifications: [] };
    reducer(before, addNotification({ _id: "x" }));
    expect(before.notifications).toHaveLength(0);
    expect(before.unreadCount).toBe(0);
  });
});
