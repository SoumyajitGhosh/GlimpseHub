const express = require('express');
const messageRouter = express.Router();

const { requireAuth } = require('../controllers/authController');

const { getMessages, sendMessage } = require("../controllers/messageController");

messageRouter.get("/:id", requireAuth, getMessages);
messageRouter.post("/send/:id", requireAuth, sendMessage);

module.exports = messageRouter;
