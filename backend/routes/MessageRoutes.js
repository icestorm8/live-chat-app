const express = require("express");
const router = express.Router();
const authenticateToken = require("../middlewares/AuthenticateJWT"); // Import the middleware
const Message = require("../models/TextMessage");
const Conversation = require("../models/Conversation"); // Import Conversation model if updating it

// Add a new message to a conversation
router.post("/send-message", authenticateToken, async (req, res) => {
  const { conversationId, content } = req.body; // Assuming these come from the frontend
  const senderId = req.user.userId; // Current logged-in user's ID from the token

  try {
    // Step 1: Create the new message in the Messages collection
    const newMessage = new Message({
      conversationId,
      senderId: senderId,
      content,
    });

    await Conversation.findByIdAndUpdate(conversationId, {
      lastMessageId: newMessage._id,
    });

    // Save the message to the database
    await newMessage.save();

    // Step 2: Optionally update the Conversation document
    // This is optional, but can be useful if you want to track all messages in the conversation document
    // await Conversation.findByIdAndUpdate(
    //   conversationId,
    //   {
    //     $push: { messages: newMessage._id }, // Push the new message ID into the messages array in the Conversation document
    //   },
    //   { new: true }
    // );

    await Conversation.findByIdAndUpdate(conversationId, {
      lastMessageId: newMessage._id,
    });

    // Step 3: Return a response
    res.status(200).json({
      message: "Message sent successfully",
      data: newMessage,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error sending message" });
  }
});

// Route to fetch all messages for a specific conversation, ordered by timestamp
router.get("/:conversationId/messages", authenticateToken, async (req, res) => {
  try {
    const { conversationId } = req.params; // Get conversationId from the route parameters

    // Fetch all messages for the given conversation and sort by timestamp
    const messages = await Message.find({ conversationId })
      .sort({ timestamp: 1 }) // Sort by timestamp in ascending order (oldest to newest)
      .populate("senderId", "name") // Populate the senderId with the user's name (optional)
      .exec();

    if (!messages) {
      return res.status(404).json({ message: "No messages found" });
    }

    res.status(200).json({ messages });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching messages" });
  }
});

module.exports = router;
