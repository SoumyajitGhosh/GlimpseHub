import { describe, it, expect } from "vitest";

import { normalizeError, authHeader } from "./apiClient";

describe("authHeader", () => {
  it("builds a bare authorization header (no Bearer prefix)", () => {
    expect(authHeader("abc123")).toEqual({
      headers: { authorization: "abc123" },
    });
  });
});

describe("normalizeError", () => {
  it("pulls the message from a { error } response body", () => {
    const err = normalizeError({
      response: { status: 400, data: { error: "Username is taken" } },
    });
    expect(err).toBeInstanceOf(Error);
    expect(err.message).toBe("Username is taken");
    expect(err.status).toBe(400);
    expect(err.isNetworkError).toBe(false);
  });

  it("handles a plain-string response body", () => {
    const err = normalizeError({
      response: { status: 404, data: "Not found" },
    });
    expect(err.message).toBe("Not found");
  });

  it("does not throw when there is no response (network error)", () => {
    const err = normalizeError({ request: {}, message: "Network Error" });
    expect(err.message).toBe("Network error — could not reach the server.");
    expect(err.status).toBe(null);
    expect(err.isNetworkError).toBe(true);
  });

  it("falls back to the error's own message when there is no response or request", () => {
    const err = normalizeError({ message: "boom" });
    expect(err.message).toBe("boom");
  });

  it("passes aborted requests through untouched", () => {
    const canceled = { code: "ERR_CANCELED" };
    expect(normalizeError(canceled)).toBe(canceled);
  });
});
