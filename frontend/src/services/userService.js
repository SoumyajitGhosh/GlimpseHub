import apiClient, { authHeader } from "./apiClient";

/**
 * Searches for a username that is similar to the one supplied.
 * Swallows non-abort errors (returns []) so the type-ahead never throws into
 * the debounced search hook; aborted requests are re-thrown so the caller can
 * ignore them.
 * @function searchUsers
 * @param {string} username The username to search for
 * @param {number} offset The number of documents to skip
 * @param {object} [config] Extra axios config (e.g. `{ signal }` for aborting)
 * @returns {array} Array of users that match the criteria
 */
export const searchUsers = async (username, offset = 0, config = {}) => {
  try {
    const { data } = await apiClient.get(
      `/user/${username}/${offset}/search`,
      config
    );
    return data;
  } catch (err) {
    if (err.code === "ERR_CANCELED") throw err;
    console.warn(err);
    return [];
  }
};

/**
 * Verifies a user's email
 * @function confirmUser
 * @param {string} authToken A user's auth token
 * @param {string} confirmationToken The token to verify an email
 */
export const confirmUser = async (authToken, confirmationToken) => {
  await apiClient.put(
    "/user/confirm",
    { token: confirmationToken },
    authHeader(authToken)
  );
};

/**
 * Uploads and changes a user's avatar
 * @function changeAvatar
 * @param {object} image The image to upload
 * @param {string} authToken A user's auth token
 * @returns {string} The new avatar url
 */
export const changeAvatar = async (image, authToken) => {
  const formData = new FormData();
  formData.append("image", image);
  const { data } = await apiClient.put("/user/avatar", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      authorization: authToken,
    },
  });
  return data;
};

/**
 * Removes a user's current avatar
 * @function removeAvatar
 * @param {string} authToken A user's auth token
 */
export const removeAvatar = async (authToken) => {
  await apiClient.delete("/user/avatar", authHeader(authToken));
};

/**
 * Updates the specified fields on the user
 * @function updateProfile
 * @param {string} authToken A user's auth token
 * @param  {object} updates An object of the fields to update on the user model
 * @returns {object} Updated user object
 */
export const updateProfile = async (authToken, updates) => {
  const { data } = await apiClient.put(
    "/user",
    { ...updates },
    authHeader(authToken)
  );
  return data;
};

/**
 * Gets random suggested users for the user to follow
 * @function getSuggestedUsers
 * @param {string} authToken A user's auth token
 * @param {number} [max] Maximum number of users to return
 * @returns {array} Array of users
 */
export const getSuggestedUsers = async (authToken, max) => {
  const { data } = await apiClient.get(
    `/user/suggested/${max || ""}`,
    authHeader(authToken)
  );
  return data;
};
