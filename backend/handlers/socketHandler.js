const { io } = require('../socket');

// Each user joins a room named after their id (see socket/index.js), so these emits
// reach the user on whichever backend instance holds their connection.
module.exports.sendNotification = (notification) => {
    const receiver = notification?.receiver?.toString();
    if (receiver) {
        io.to(receiver).emit('newNotification', notification);
    }
};

module.exports.sendPost = (post, receiver) => {
    if (receiver) {
        io.to(receiver.toString()).emit('newPost', post);
    }
};

module.exports.deletePost = (postId, receiver) => {
    if (receiver) {
        io.to(receiver.toString()).emit('deletePost', postId);
    }
};

module.exports.newMessage = (newMessage, receiver) => {
    if (receiver) {
        io.to(receiver.toString()).emit('newMessage', newMessage);
    }
};
