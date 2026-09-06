import apiClient, { authHeader } from "./apiClient";

/**
 * Logs a user in with the provided credentials
 * @function login
 * @param {string} usernameOrEmail The username or email to login with
 * @param {string} password A password to log in with
 * @param {string} authToken A token to be used instead of a username/email or password
 * @returns {object} The user object
 */
export const login = async (usernameOrEmail, password, authToken) => {
  const { data } =
    usernameOrEmail && password
      ? await apiClient.post("/auth/login", { usernameOrEmail, password })
      : await apiClient.post("/auth/login", null, authHeader(authToken));
  return data;
};

/**
 * Logs the user in or signs them up with their github account
 * @function githubAuthentication
 * @param {number} code Code provided by github to exchange for an access code
 * @returns {object} User object
 */
export const githubAuthentication = async (code) => {
  const { data } = await apiClient.post("/auth/login/github", {
    code,
    state: sessionStorage.getItem("authState"),
  });
  return data;
};

/**
 * Registers a user with the provided credentials
 * @param {string} email A user's email address
 * @param {string} fullName A user's full name
 * @param {string} username A user's username
 * @param {string} password A user's password
 * @returns {object} The user object
 */
export const registerUser = async (email, fullName, username, password) => {
  const { data } = await apiClient.post("/auth/register", {
    email,
    fullName,
    username,
    password,
  });
  return data;
};

/**
 * Changes a users password
 * @function changePassword
 * @param {string} oldPassword The user's current password
 * @param {string} newPassword The new password
 * @param {string} authToken A user's auth token
 */
export const changePassword = async (oldPassword, newPassword, authToken) => {
  await apiClient.put(
    "/auth/password",
    { oldPassword, newPassword },
    authHeader(authToken)
  );
};
