import { describe, it, expect } from "vitest";

import reducer, { selectCurrentUser, type UserState } from "./userSlice";
import type { RootState } from "../store";

const base: UserState = {
  currentUser: null,
  error: false,
  fetching: false,
  fetchingAvatar: false,
  updatingProfile: false,
  token: null,
};

const state = (overrides: Partial<UserState>): UserState =>
  ({ ...base, ...overrides }) as UserState;

const act = (type: string, payload?: unknown) => ({
  type: `user/${type}`,
  payload,
});

describe("userSlice", () => {
  it("authSuccess stores the user + token", () => {
    const next = reducer(
      base,
      act("authSuccess", { user: { username: "a" }, token: "t1" })
    );
    expect(next.currentUser).toEqual({ username: "a" });
    expect(next.token).toBe("t1");
    expect(next.fetching).toBe(false);
  });

  it("signedOut clears user + token", () => {
    const next = reducer(
      state({ currentUser: { username: "a" } as unknown as UserState["currentUser"], token: "t1" }),
      act("signedOut")
    );
    expect(next.currentUser).toBe(null);
    expect(next.token).toBe(null);
  });

  it("bookmarkToggled add / remove", () => {
    const withUser = state({
      currentUser: { bookmarks: [] } as unknown as UserState["currentUser"],
    });
    const added = reducer(
      withUser,
      act("bookmarkToggled", { operation: "add", postId: "p1" })
    );
    expect(added.currentUser?.bookmarks).toEqual([{ post: "p1" }]);
    const removed = reducer(
      added,
      act("bookmarkToggled", { operation: "remove", postId: "p1" })
    );
    expect(removed.currentUser?.bookmarks).toEqual([]);
  });

  it("avatarRemoved deletes the avatar key without dropping other fields", () => {
    const next = reducer(
      state({
        currentUser: { username: "a", avatar: "url" } as unknown as UserState["currentUser"],
      }),
      act("avatarRemoved")
    );
    expect(next.currentUser).toEqual({ username: "a" });
    expect(next.fetchingAvatar).toBe(false);
  });

  it("profileUpdated merges fields", () => {
    const next = reducer(
      state({
        currentUser: { username: "a", bio: "old" } as unknown as UserState["currentUser"],
      }),
      act("profileUpdated", { bio: "new" })
    );
    expect(next.currentUser).toEqual({ username: "a", bio: "new" });
  });

  it("selectCurrentUser reads state.user.currentUser", () => {
    expect(
      selectCurrentUser({
        user: { currentUser: { username: "a" } },
      } as unknown as RootState)
    ).toEqual({ username: "a" });
  });
});
