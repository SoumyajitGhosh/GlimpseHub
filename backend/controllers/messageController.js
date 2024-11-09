// import Conversation from "../models/conversation.model.js";
// import Message from "../models/message.model.js";
// import { getReceiverSocketId, io } from "../socket/socket.js";
const Conversation = require("../models/Conversation");
const Message = require("../models/Message");
const socketHandler = require('../handlers/socketHandler');

module.exports.sendMessage = async (req, res) => {
    try {
        const { message } = req.body;
        const { id: receiverId } = req.params;
        const user = res.locals.user;
        const senderId = user._id;

        let conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] },
        });

        if (!conversation) {
            conversation = await Conversation.create({
                participants: [senderId, receiverId],
            });
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            message,
        });

        if (newMessage) {
            conversation.messages.push(newMessage._id);
        }

        // await conversation.save();
        // await newMessage.save();

        // this will run in parallel
        await Promise.all([conversation.save(), newMessage.save()]);

        // SOCKET IO FUNCTIONALITY WILL GO HERE
        socketHandler.newMessage(newMessage, receiverId);
        socketHandler.newMessage(newMessage, senderId);

        res.status(201).json(newMessage);
    } catch (error) {
        console.log("Error in sendMessage controller: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

module.exports.getMessages = async (req, res) => {
    try {
        const { id: userToChatId } = req.params;
        const user = res.locals.user;
        const senderId = user._id;

        const conversation = await Conversation.findOne({
            participants: { $all: [senderId, userToChatId] },
        }).populate("messages"); // NOT REFERENCE BUT ACTUAL MESSAGES

        if (!conversation) return res.status(200).json([]);

        const messages = conversation.messages;

        res.status(200).json(messages);
    } catch (error) {
        console.log("Error in getMessages controller: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};
