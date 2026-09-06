import { describe, it, expect } from "vitest";

import reducer, { selectCurrentUser } from "./userSlice";

const base = {
  currentUser: null,
  error: false,
  fetching: false,
  fetchingAvatar: false,
  updatingProfile: false,
  token: null,
};

const act = (type, payload) => ({ type: `user/${type}`, payload });

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
      { ...base, currentUser: { username: "a" }, token: "t1" },
      act("signedOut")
    );
    expect(next.currentUser).toBe(null);
    expect(next.token).toBe(null);
  });

  it("bookmarkToggled add / remove", () => {
    const withUser = { ...base, currentUser: { bookmarks: [] } };
    const added = reducer(
      withUser,
      act("bookmarkToggled", { operation: "add", postId: "p1" })
    );
    expect(added.currentUser.bookmarks).toEqual([{ post: "p1" }]);
    const removed = reducer(
      added,
      act("bookmarkToggled", { operation: "remove", postId: "p1" })
    );
    expect(removed.currentUser.bookmarks).toEqual([]);
  });

  it("avatarRemoved deletes the avatar key without dropping other fields", () => {
    const next = reducer(
      { ...base, currentUser: { username: "a", avatar: "url" } },
      act("avatarRemoved")
    );
    expect(next.currentUser).toEqual({ username: "a" });
    expect(next.fetchingAvatar).toBe(false);
  });

  it("profileUpdated merges fields", () => {
    const next = reducer(
      { ...base, currentUser: { username: "a", bio: "old" } },
      act("profileUpdated", { bio: "new" })
    );
    expect(next.currentUser).toEqual({ username: "a", bio: "new" });
  });

  it("selectCurrentUser reads state.user.currentUser", () => {
    expect(
      selectCurrentUser({ user: { currentUser: { username: "a" } } })
    ).toEqual({ username: "a" });
  });
});
