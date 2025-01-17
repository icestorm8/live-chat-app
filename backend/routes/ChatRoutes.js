const express = require("express");
const authenticateToken = require("../middlewares/AuthenticateJWT"); // Import the middleware
const Conversation = require("../models/Conversation"); // Import the User model
const router = express.Router();

// GET - fetch all chats for the current user
router.get("/api/chats", authenticateToken, async (req, res) => {
  try {
    const chats = await Conversation.find({ users: req.user.userId }); // Find all chats with the current user
    res.json(chats);
  } catch (err) {
    res.status(500).json({ message: "Error fetching chats" });
  }
});

// GET - fetch specific chat content by its id
router.get("/api/chats/:chatId", authenticateToken, async (req, res) => {
  const chatid = req.params.chatId;
  try {
    const chat = await Conversation.findById(chatid).populate("users"); // Populate users in the chat; // Find all chats with the current user
    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    res.status(200).json(chat);
  } catch (err) {
    res.status(500).json({ message: "Error fetching chat" });
  }
});
module.exports = router; // Correct way to export
