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
import { login, registerUser, changePassword } from "./authenticationServices";

beforeEach(() => vi.clearAllMocks());

describe("authenticationServices.login", () => {
  it("posts credentials when a username + password are given", async () => {
    apiClient.post.mockResolvedValue({ data: { token: "t" } });
    await login("alice", "pw");
    expect(apiClient.post).toHaveBeenCalledWith("/auth/login", {
      usernameOrEmail: "alice",
      password: "pw",
    });
  });

  it("posts with an explicit auth header when only a token is given", async () => {
    apiClient.post.mockResolvedValue({ data: { token: "t" } });
    await login(null, null, "existing-token");
    expect(apiClient.post).toHaveBeenCalledWith("/auth/login", null, {
      headers: { authorization: "existing-token" },
    });
  });
});

describe("authenticationServices misc", () => {
  it("registerUser posts the full payload", async () => {
    apiClient.post.mockResolvedValue({ data: {} });
    await registerUser("e@x.com", "E X", "ex", "pw");
    expect(apiClient.post).toHaveBeenCalledWith("/auth/register", {
      email: "e@x.com",
      fullName: "E X",
      username: "ex",
      password: "pw",
    });
  });

  it("changePassword PUTs old/new with the auth header", async () => {
    apiClient.put.mockResolvedValue({ data: {} });
    await changePassword("old", "new", "tok");
    expect(apiClient.put).toHaveBeenCalledWith(
      "/auth/password",
      { oldPassword: "old", newPassword: "new" },
      { headers: { authorization: "tok" } }
    );
  });
});
