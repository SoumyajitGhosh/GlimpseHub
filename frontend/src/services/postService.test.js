import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("./apiClient", () => {
  const apiClient = {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  };
  return {
    default: apiClient,
    authHeader: (token) => ({ headers: { authorization: token } }),
  };
});

import apiClient from "./apiClient";
import {
  getPost,
  getPosts,
  votePost,
  deletePost,
  getSuggestedPosts,
  getHashtagPosts,
  createPost,
} from "./postService";

beforeEach(() => {
  vi.clearAllMocks();
});

describe("postService", () => {
  it("getPost hits /post/:id and returns response.data", async () => {
    apiClient.get.mockResolvedValue({ data: { _id: "p1" } });
    await expect(getPost("p1")).resolves.toEqual({ _id: "p1" });
    expect(apiClient.get).toHaveBeenCalledWith("/post/p1");
  });

  it("getPosts builds the paged path", async () => {
    apiClient.get.mockResolvedValue({ data: [] });
    await getPosts("alice", 20);
    expect(apiClient.get).toHaveBeenCalledWith("/user/alice/posts/20");
  });

  it("getSuggestedPosts / getHashtagPosts send the auth header", async () => {
    apiClient.get.mockResolvedValue({ data: [] });
    await getSuggestedPosts("tok", 5);
    expect(apiClient.get).toHaveBeenCalledWith("/post/suggested/5", {
      headers: { authorization: "tok" },
    });
    await getHashtagPosts("tok", "sunset", 0);
    expect(apiClient.get).toHaveBeenCalledWith("/post/hashtag/sunset/0", {
      headers: { authorization: "tok" },
    });
  });

  it("votePost / deletePost resolve without a return value", async () => {
    apiClient.post.mockResolvedValue({ data: {} });
    apiClient.delete.mockResolvedValue({ data: {} });
    await expect(votePost("p1", "tok")).resolves.toBeUndefined();
    await expect(deletePost("p1", "tok")).resolves.toBeUndefined();
  });

  it("createPost sends multipart headers", async () => {
    apiClient.post.mockResolvedValue({ data: { _id: "p2" } });
    const fd = new FormData();
    await createPost(fd, "tok");
    expect(apiClient.post).toHaveBeenCalledWith("/post", fd, {
      headers: {
        authorization: "tok",
        "Content-Type": "multipart/form-data",
      },
    });
  });

  it("propagates the (already-normalized) error from the client", async () => {
    apiClient.get.mockRejectedValue(new Error("Post not found"));
    await expect(getPost("nope")).rejects.toThrow("Post not found");
  });
});
