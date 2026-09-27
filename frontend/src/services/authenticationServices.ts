import apiClient, { authHeader } from "./apiClient";
import type { LoginResponse, RegisterResponse } from "../types";

/**
 * Logs a user in with the provided credentials, or resumes a session from a
 * stored token when `usernameOrEmail`/`password` are omitted.
 */
export const login = async (
  usernameOrEmail: string | null,
  password: string | null,
  authToken?: string | null
): Promise<LoginResponse> => {
  const { data } =
    usernameOrEmail && password
      ? await apiClient.post<LoginResponse>("/auth/login", { usernameOrEmail, password })
      : await apiClient.post<LoginResponse>("/auth/login", null, authHeader(authToken));
  return data;
};

/**
 * Logs the user in or signs them up with their github account.
 */
export const githubAuthentication = async (code: string): Promise<LoginResponse> => {
  const { data } = await apiClient.post<LoginResponse>("/auth/login/github", {
    code,
    state: sessionStorage.getItem("authState"),
  });
  return data;
};

/**
 * Registers a user with the provided credentials.
 */
export const registerUser = async (
  email: string,
  fullName: string,
  username: string,
  password: string
): Promise<RegisterResponse> => {
  const { data } = await apiClient.post<RegisterResponse>("/auth/register", {
    email,
    fullName,
    username,
    password,
  });
  return data;
};

/**
 * Changes a user's password.
 */
export const changePassword = async (
  oldPassword: string,
  newPassword: string,
  authToken: string
): Promise<void> => {
  await apiClient.put(
    "/auth/password",
    { oldPassword, newPassword },
    authHeader(authToken)
  );
};
