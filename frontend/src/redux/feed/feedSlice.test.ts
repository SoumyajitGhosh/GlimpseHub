import { describe, it, expect } from "vitest";

import reducer, {
  addPost,
  removePost,
  clearPosts,
  type FeedState,
} from "./feedSlice";
import type { Post } from "../../types";

const post = (id: string) => ({ _id: id }) as unknown as Post;

const state = (overrides: Partial<FeedState> = {}): FeedState => ({
  posts: [],
  fetching: true,
  error: false,
  hasMore: false,
  ...overrides,
});

describe("feedSlice", () => {
  it("addPost prepends", () => {
    const next = reducer(state({ posts: [post("b")] }), addPost(post("a")));
    expect(next.posts.map((p) => p._id)).toEqual(["a", "b"]);
  });

  it("removePost removes the post at index 0 (the old `if (postIndex)` bug)", () => {
    const next = reducer(
      state({ posts: [post("a"), post("b")] }),
      removePost("a")
    );
    expect(next.posts.map((p) => p._id)).toEqual(["b"]);
  });

  it("removePost is a no-op for an unknown id", () => {
    const start = state({ posts: [post("a")] });
    expect(reducer(start, removePost("z")).posts).toEqual([{ _id: "a" }]);
  });

  it("clearPosts empties without touching flags", () => {
    const next = reducer(
      state({ posts: [post("a")], hasMore: true }),
      clearPosts()
    );
    expect(next.posts).toEqual([]);
    expect(next.hasMore).toBe(true);
  });
});
