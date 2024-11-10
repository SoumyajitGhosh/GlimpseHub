const { io, getReceiverSocketId } = require('../socket'); // Import io and helper function

module.exports.sendNotification = (notification) => {
    const receiverSocketId = getReceiverSocketId(notification?.receiver?.toString());
    if (receiverSocketId) {
        io.sockets.to(receiverSocketId).emit('newNotification', notification);
    }
};

module.exports.sendPost = (post, receiver) => {
    const receiverSocketId = getReceiverSocketId(receiver?.toString());
    if (receiverSocketId) {
        io.sockets.to(receiverSocketId).emit('newPost', post);
    }
};

module.exports.deletePost = (postId, receiver) => {
    const receiverSocketId = getReceiverSocketId(receiver?.toString());
    if (receiverSocketId) {
        io.sockets.to(receiverSocketId).emit('deletePost', postId);
    }
};

module.exports.newMessage = (newMessage, receiver) => {
    const receiverSocketId = getReceiverSocketId(receiver);
    if (receiverSocketId) {
        // io.to(<socket_id>).emit() used to send events to specific client
        io.to(receiverSocketId).emit('newMessage', newMessage);
    }
} 
