const { Server } = require("socket.io");
const http = require("http");
const express = require("express");
const jwt = require('jwt-simple');
const { createAdapter } = require("@socket.io/redis-adapter");
const { getRedisClient } = require("../utils/redis");

const app = express();

app.use(express.json());


const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        // Restricted to the configured frontend origin when set; falls back to
        // wide-open so local dev without HOME_URL in .env keeps working.
        origin: process.env.HOME_URL || "*",
        methods: ["GET", "POST"],
    },
});

// Multi-instance: with REDIS_URL set, io.to(room).emit() is relayed to every backend instance.
const redisClient = getRedisClient();
if (redisClient) {
    io.adapter(createAdapter(redisClient, redisClient.duplicate()));
}

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

    // One room per user: events target `io.to(userId)`, which works across instances
    // (and across a user's several tabs/devices) without any in-memory lookup table.
    socket.join(userId);

    socket.on("disconnect", () => {
        console.log("User disconnected:", userId);
    });
});

module.exports = { app, io, server };
