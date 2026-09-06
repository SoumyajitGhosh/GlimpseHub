import { describe, it, expect } from "vitest";

import reducer, { selectProfileData, INITIAL_STATE } from "./profilePageSlice";

const follow = { type: "profile/followUserSuccess", payload: "follow" };
const unfollow = { type: "profile/followUserSuccess", payload: "unfollow" };

describe("profilePageSlice", () => {
  it("followUserSuccess('follow') sets isFollowing and bumps the count", () => {
    const state = { ...INITIAL_STATE, data: { followers: 3, posts: [] } };
    const next = reducer(state, follow);
    expect(next.data.isFollowing).toBe(true);
    expect(next.data.followers).toBe(4);
    expect(next.following).toBe(false);
  });

  it("followUserSuccess('unfollow') clears isFollowing and decrements", () => {
    const state = {
      ...INITIAL_STATE,
      data: { followers: 3, isFollowing: true, posts: [] },
    };
    const next = reducer(state, unfollow);
    expect(next.data.isFollowing).toBe(false);
    expect(next.data.followers).toBe(2);
  });

  it("fetchProfileSuccess unwraps posts.data / posts.postCount", () => {
    const next = reducer(INITIAL_STATE, {
      type: "profile/fetchProfileSuccess",
      payload: {
        user: { username: "x" },
        posts: { data: [{ _id: "p1" }], postCount: 9 },
      },
    });
    expect(next.data.posts).toEqual([{ _id: "p1" }]);
    expect(next.data.postCount).toBe(9);
    expect(selectProfileData({ profile: next })).toBe(next.data);
  });

  it("addPosts appends to the existing list", () => {
    const state = {
      ...INITIAL_STATE,
      data: { posts: [{ _id: "p1" }] },
    };
    const next = reducer(state, {
      type: "profile/addPosts",
      payload: [{ _id: "p2" }],
    });
    expect(next.data.posts.map((p) => p._id)).toEqual(["p1", "p2"]);
  });
});
