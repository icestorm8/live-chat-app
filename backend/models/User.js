const mongoose = require("mongoose");

// Define the User schema
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true, // Ensure usernames are unique
      minlength: 3, // Min length for username
      maxlength: 30, // Max length for username
    },
    //   email: {
    //     type: String,
    //     required: true,
    //     unique: true, // Ensure emails are unique
    //     lowercase: true,
    //     match: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/, // Basic email format validation
    //   },
    password: {
      type: String,
      required: true,
    },
    isOnline: {
      type: Boolean,
      default: false, // Default to offline
    },
    lastLogin: {
      type: Date,
      default: Date.now,
    },
    lastUpdate: {
      type: Date,
      default: Date.now,
    },
    friendList: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    // avatarUrl: {
    //   type: String,
    //   default: "", // URL for profile picture (optional)
    // },
  },
  { timestamps: true }
); // Add timestamps (createdAt, updatedAt)

// Create a User model
const User = mongoose.model("User", userSchema);

module.exports = User;
