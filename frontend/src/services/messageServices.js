import axios from 'axios';

/**
 * Retrieves a users notifications
 * @function sendMessage
 * @param {string} id Receiver's ID
 * @param {string} authToken A user's auth token
 * @returns {object} Object containing message and message details
 */
export const sendMessage = async (id, authToken, message) => {
    try {
        const response = await axios.post(`${import.meta.env.VITE_BACKEND_URI}/api/message/send/${id}`, {
            message
        }, {
            headers: {
                authorization: authToken,
            },
        });
        return response.data;
    } catch (err) {
        throw new Error(err.response.data);
    }
};

/**
 *
 * @param {string} id ID of the user with whom the chat we need to fetch
 * @param {string} authToken A user's auth token
 * @returns {array} Array of objects(each object is a message)
 */
export const getMessages = async (id, authToken) => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URI}/api/message/${id}`, {
            headers: {
                authorization: authToken,
            },
        });
        return response.data;
    } catch (err) {
        throw new Error(err.response.data.error);
    }
};
