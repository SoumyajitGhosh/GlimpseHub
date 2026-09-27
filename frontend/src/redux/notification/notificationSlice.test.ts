import { describe, it, expect } from "vitest";

import reducer, {
  addNotification,
  clearNotifications,
  type NotificationState,
} from "./notificationSlice";
import type { Notification } from "../../types";

const notif = (id: string) => ({ _id: id }) as unknown as Notification;

const initial: NotificationState = {
  notifications: [],
  unreadCount: 0,
  fetching: false,
  error: false,
};

describe("notificationSlice", () => {
  it("addNotification prepends and bumps unreadCount", () => {
    const s1 = reducer(initial, addNotification(notif("n1")));
    const s2 = reducer(s1, addNotification(notif("n2")));
    expect(s2.notifications.map((n) => n._id)).toEqual(["n2", "n1"]);
    expect(s2.unreadCount).toBe(2);
  });

  it("clearNotifications resets list and count", () => {
    const seeded: NotificationState = {
      ...initial,
      notifications: [notif("n1")],
      unreadCount: 1,
    };
    expect(reducer(seeded, clearNotifications())).toEqual(initial);
  });

  it("does not mutate the input state", () => {
    const before: NotificationState = { ...initial, notifications: [] };
    reducer(before, addNotification(notif("x")));
    expect(before.notifications).toHaveLength(0);
    expect(before.unreadCount).toBe(0);
  });
});
