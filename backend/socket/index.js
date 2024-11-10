const { Server } = require("socket.io");
const http = require("http");
const express = require("express");
const jwt = require('jwt-simple');

const app = express();

app.use(express.json());


const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        // origin: ["http://localhost:5173"],
        origin: "*",
        methods: ["GET", "POST"],
    },
});

const userSocketMap = {}; // {userId: socketId}

const getReceiverSocketId = (receiverId) => {
    return userSocketMap[receiverId];
};

io.use((socket, next) => {
    // Retrieve the token from query parameters in the handshake
    const token = socket.handshake.query.token;

    if (!token) {
        return next(new Error("Not authorized. No token provided."));
    }

    try {
        // Decode and verify the JWT token
        const user = jwt.decode(token, process.env.JWT_SECRET);


        if (!user) {
            return next(new Error("Not authorized. Invalid user."));
        }

        // Attach the decoded user to the socket for later access
        socket.user = user;
        next();
    } catch (err) {
        next(new Error("Not authorized. Invalid token."));
    }
}).on("connection", (socket) => {
    const { user } = socket;
    const userId = user.id;  // Assuming `id` is part of the decoded JWT payload

    console.log("User connected:", userId, "with socket ID:", socket.id);

    // Map the user's ID to their socket ID
    userSocketMap[userId] = socket.id;

    // Notify all clients of online users
    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    // Handle disconnection
    socket.on("disconnect", () => {
        console.log("User disconnected:", userId);
        delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
});

module.exports = { app, io, server, getReceiverSocketId };
