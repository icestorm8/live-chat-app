const express = require("express");
const authenticateToken = require("../middlewares/AuthenticateJWT"); // Import the middleware
const Conversation = require("../models/Conversation"); // Import the User model
const User = require("../models/User"); // Import the User model
const Message = require("../models/TextMessage");
const router = express.Router();
router.post("/create", authenticateToken, async (req, res) => {
  const { recipientId } = req.body; // Get the recipient userId from the request body

  const senderId = req.user.userId; // Get the sender's userId from the authenticated token

  // Check if the sender and recipient are the same user (cannot chat with themselves)
  if (senderId === recipientId) {
    return res.status(400).json({ message: "Cannot chat with yourself" });
  }

  try {
    // Check if a conversation already exists between the two users
    var existingConversation = await Conversation.findOne({
      users: { $all: [senderId, recipientId] },
    });

    if (existingConversation) {
      // If the conversation already exists, return it
      if (existingConversation.lastMessageId) {
        const lastMessage = await Message.findById(
          existingConversation.lastMessageId
        );
        existingConversation = {
          ...existingConversation.toObject(),
          lastMessage: lastMessage,
        };
        console.log(existingConversation);
        return res.status(200).json({
          message: "Conversation already exists",
          conversation: existingConversation,
        });
      } else {
        return res.status(200).json({
          message: "Conversation already exists",
          conversation: existingConversation,
        });
      }
    }

    // Create a new conversation between the two users
    const newConversation = new Conversation({
      users: [senderId, recipientId],
    });

    // Save the new conversation to the database
    await newConversation.save();

    res.status(201).json({
      message: "New conversation created successfully",
      conversation: newConversation,
    });
  } catch (err) {
    console.error(err);
    res.status(500).j;
  }
});

router.get(
  "/:conversationId/other-user",
  authenticateToken,
  async (req, res) => {
    const { conversationId } = req.params; // chat id
    const loggedUserId = req.user.userId;
    // console.log("conversationId" + conversationId);
    try {
      const conversation = await Conversation.findById(conversationId);

      const otherUserId = conversation.users.filter(
        (userId) => userId.toString() !== loggedUserId.toString()
      );
      if (!otherUserId) {
        return res.status(404).json({ message: "other users id wasn't found" });
      }

      const otherUser = await User.findById(otherUserId);
      if (!otherUser) {
        return res.status(404).json({ message: "user does not exist" });
      }

      res.status(200).json({ message: "found other user", otherUser });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Error fetching other user" });
    }
  }
);
router.get("/", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId; // Get the userId of the logged-in user from the authentication token
    console.log(userId);

    // Find all conversations where the current user's ID is in the users array
    const chats = await Conversation.find({ users: userId });
    console.log(chats);
    // Loop through each chat and filter out the current user from the users array
    const chatsWithOtherUser = await Promise.all(
      chats.map(async (chat) => {
        console.log(chat);
        const otherUserId = chat.users.find(
          (id) => id.toString() !== userId.toString()
        );

        // Find the user details of the other user (not the current user)
        // console.log(otherUserId);
        const otherUser = await User.findById(otherUserId);
        // console.log("user:" + otherUser);

        var lastMessage = await Message.findById(chat.lastMessageId);
        const user = await User.findById(lastMessage.senderId);
        // console.log("username: " + user.username);
        var lastMessage = {
          ...lastMessage.toObject(),
          username: user.username,
        };
        return {
          ...chat.toObject(), // Return the chat object as it is
          otherUserName: otherUser ? otherUser.username : "Unknown", // Add the other user's name
          lastMessage: lastMessage,
        };
      })
    );

    res.status(200).json({ chats: chatsWithOtherUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching chats" });
  }
});

module.exports = router; // Correct way to export
