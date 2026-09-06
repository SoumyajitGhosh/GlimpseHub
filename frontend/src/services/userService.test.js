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
import { searchUsers, updateProfile, getSuggestedUsers } from "./userService";

beforeEach(() => {
  vi.clearAllMocks();
  vi.spyOn(console, "warn").mockImplementation(() => {});
});

describe("userService.searchUsers", () => {
  it("returns the matched users", async () => {
    apiClient.get.mockResolvedValue({ data: [{ username: "bob" }] });
    await expect(searchUsers("bo", 0)).resolves.toEqual([{ username: "bob" }]);
    expect(apiClient.get).toHaveBeenCalledWith("/user/bo/0/search", {});
  });

  it("swallows non-abort errors and returns an empty array", async () => {
    apiClient.get.mockRejectedValue(new Error("500"));
    await expect(searchUsers("bo")).resolves.toEqual([]);
  });

  it("re-throws aborted requests so the caller can ignore them", async () => {
    const canceled = Object.assign(new Error("canceled"), {
      code: "ERR_CANCELED",
    });
    apiClient.get.mockRejectedValue(canceled);
    await expect(searchUsers("bo")).rejects.toBe(canceled);
  });

  it("forwards an abort signal to the client", async () => {
    apiClient.get.mockResolvedValue({ data: [] });
    const signal = new AbortController().signal;
    await searchUsers("bo", 0, { signal });
    expect(apiClient.get).toHaveBeenCalledWith("/user/bo/0/search", { signal });
  });
});

describe("userService misc", () => {
  it("updateProfile PUTs the updates with the auth header", async () => {
    apiClient.put.mockResolvedValue({ data: { username: "new" } });
    await updateProfile("tok", { username: "new" });
    expect(apiClient.put).toHaveBeenCalledWith(
      "/user",
      { username: "new" },
      { headers: { authorization: "tok" } }
    );
  });

  it("getSuggestedUsers omits the max segment when not given", async () => {
    apiClient.get.mockResolvedValue({ data: [] });
    await getSuggestedUsers("tok");
    expect(apiClient.get).toHaveBeenCalledWith("/user/suggested/", {
      headers: { authorization: "tok" },
    });
  });
});
