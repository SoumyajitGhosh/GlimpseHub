import axios from "axios";

/**
 * The single axios instance every service call goes through.
 *
 * - `baseURL` is `${VITE_BACKEND_URI}/api`, so callers pass only the path
 *   (`apiClient.get("/post/feed/0")`).
 * - A request interceptor attaches the stored auth token as the bare
 *   `authorization` header (no `Bearer` prefix — the backend reads the raw
 *   value) unless the caller already set one.
 * - A response interceptor normalises every failure to an `Error` with a
 *   human-readable `.message`, so callers can surface `err.message` directly
 *   and never crash dereferencing a missing `err.response` (network errors,
 *   CORS failures, aborted requests).
 */
const apiClient = axios.create({
  baseURL: `${import.meta.env.VITE_BACKEND_URI}/api`,
});

apiClient.interceptors.request.use((config) => {
  if (!config.headers.authorization) {
    const token = localStorage.getItem("token");
    if (token) config.headers.authorization = token;
  }
  return config;
});

/**
 * Turn any axios failure into an `Error` with a readable `.message`, plus
 * `.status` (HTTP status or null) and `.isNetworkError`. Aborted requests are
 * passed through untouched so callers can detect `err.code === "ERR_CANCELED"`.
 * @param {*} error The value axios rejected with
 * @returns {Error}
 */
export const normalizeError = (error) => {
  if (axios.isCancel(error) || error?.code === "ERR_CANCELED") {
    return error;
  }

  let message;
  if (error?.response) {
    const { data, status, statusText } = error.response;
    message =
      (data && (typeof data === "string" ? data : data.error)) ||
      statusText ||
      `Request failed with status ${status}`;
  } else if (error?.request) {
    message = "Network error — could not reach the server.";
  } else {
    message = error?.message || "Something went wrong.";
  }

  const normalised = new Error(message);
  normalised.status = error?.response?.status ?? null;
  normalised.isNetworkError = !error?.response;
  normalised.cause = error;
  return normalised;
};

apiClient.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(normalizeError(error))
);

export default apiClient;

/**
 * Build an explicit `authorization` header for calls that must send a token
 * other than the stored one (a fresh login token, an email-confirmation
 * token). Regular calls can omit this and let the request interceptor attach
 * `localStorage.token`.
 * @param {string} token
 * @returns {{ headers: { authorization: string } }}
 */
export const authHeader = (token) => ({ headers: { authorization: token } });
