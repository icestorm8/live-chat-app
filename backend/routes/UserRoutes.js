const express = require("express");
const bcrypt = require("bcryptjs"); // For password hashing
const jwt = require("jsonwebtoken"); // For authenticating the user
const authenticateToken = require("../middlewares/AuthenticateJWT"); // Import the middleware
const User = require("../models/User"); // Import the User model
const { default: mongoose } = require("mongoose");
const router = express.Router();

// POST route for creating a new user
router.post("/register", async (req, res) => {
  const { username, password } = req.body;

  // re Check if required fields are provided
  if (!username || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({
        message: "Username already used, please choose a different one",
      });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
      username,
      password: hashedPassword,
    });

    // Save the user to the database
    newUser.isOnline = true;
    await newUser.save();

    // Create JWT token (sign with user ID and other data)
    const token = jwt.sign(
      { userId: newUser._id, username: newUser.username }, // Payload (data to include in token)
      process.env.JWT_SECRET, // Secret key (should be stored in environment variable)
      { expiresIn: "1h" } // Optional: token expiration time (1 hour here)
    );

    // Respond with the created user (or a success message) & send jwt token to client
    res
      .status(201)
      .json({ message: "User created successfully", user: newUser, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
});

// GET route for login in an existing user
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  // re Check if required fields are provided
  if (!username || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Check if user already exists
    const user = await User.findOne({ username });
    if (!user) {
      // user doesn't exist - error
      return res.status(404).json({
        message: "username or password incorrect",
      });
    }
    // compare passwords
    const isCorrectPassword = await bcrypt.compare(password, user.password);
    if (!isCorrectPassword) {
      // incorrect password
      return res.status(401).json({
        message: "incorrect password",
      });
    }

    // Update the last login time
    user.lastLogin = Date.now(); // Set to current time
    user.isOnline = true;
    await user.save(); // Save the updated user document

    // Create JWT token (sign with user ID and other data)
    const token = jwt.sign(
      { userId: user._id, username: user.username }, // Payload (data to include in token)
      process.env.JWT_SECRET, // Secret key (should be stored in environment variable)
      { expiresIn: "1h" } // Optional: token expiration time (1 hour here)
    );

    const userResponse = user.toObject();
    delete userResponse.password; // Remove the password before sending the response

    // return user object & token to client
    res
      .status(200)
      .json({ message: "Login successful!", user: userResponse, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
});

// GET route for getting my info (logged in user)
router.get("/me", authenticateToken, async (req, res) => {
  try {
    // authenticate token will recover the user id from the jwt token so i can fetch the user's data
    // get user by id (don't return the password as its a sensitive data)
    const user = await User.findById(req.user.userId).select("-password");
    if (!user) {
      // user doesn't exist - error
      return res.status(404).json({
        message: "user wasn't found",
      });
    }

    const userResponse = user.toObject();
    delete userResponse.password; // Remove the password before sending the response

    // return user data
    res.status(200).json({
      message: "User profile fetched successfully.",
      user: userResponse,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
});

// PUT (UPDATE) route to set user status to 'offline'
router.put("/setIsConnected", authenticateToken, async (req, res) => {
  const isConnected = req.body.isConnected;
  try {
    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { isOnline: isConnected },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User not found", user: user });
  } catch (err) {
    res.status(500).json({ message: "Error setting user offline status" });
  }
});

router.get("/friends", authenticateToken, async (req, res) => {
  const userId = req.user.userId;

  try {
    const currentUser = await User.findById(userId).select("friendList");
    console.log(currentUser);
    if (!currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // // Ensure friendList contains ObjectId values
    // const friendIds = currentUser.friendList.map((id) =>
    //   mongoose.Types.ObjectId(id)
    // );

    // Use the $in operator to find all user objects with IDs in the friendList array
    const friends = await User.find({
      _id: { $in: currentUser.friendList }, // Ensure friendIds is an array of ObjectIds
    }).select("-password");

    console.log(friends);
    // Return the array of friend objects
    res.status(200).json({
      message: "Friend list retrieved successfully.",
      friends,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
});

// GET route for getting user info (as other user)
router.get("/:userId", authenticateToken, async (req, res) => {
  const userId = req.params.userId; // get user id
  const currentUser = await User.findById(req.user.userId).populate(
    "friendList",
    "username isOnline"
  );
  try {
    // get user by id (don't return the password as its a sensitive data)

    const user = await User.findById(userId).select("-password");
    if (!user) {
      // user doesn't exist - error
      return res.status(404).json({
        message: "user wasn't found",
      });
    }
    if (!currentUser) {
      return res.status(404).json({
        message: "are you logged in?",
      });
    }
    // Check if the other user is in the current user's friend list
    const areFriends = currentUser.friendList.some(
      (friend) => friend._id.toString() === userId
    );

    //  // Respond with the result
    //  res.json({
    //    areFriends,
    //    message: areFriends ? "You are friends" : "You are not friends",
    //  });

    const userResponse = user.toObject();
    userResponse.areFriends = areFriends;
    delete userResponse.password; // Remove the password before sending the response

    // Send the response to the client
    return res.status(200).json({
      message: "User profile fetched successfully.",
      user: userResponse,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
});

// GET route for getting user info (as other user)
router.put("/:userId/setFriendship", authenticateToken, async (req, res) => {
  const userId = req.params.userId; // get user id

  try {
    if (userId === req.user.userId) {
      return res.status(404).json({
        message: "can't be friends with yourselves",
      });
    }
    // get user by id (don't return the password as its a sensitive data)
    const currentUser = await User.findById(req.user.userId).populate(
      "friendList",
      "username isOnline"
    );
    const user = await User.findById(userId).select("-password");
    if (!user) {
      // user doesn't exist - error
      return res.status(404).json({
        message: "user wasn't found",
      });
    }
    if (!currentUser) {
      return res.status(404).json({
        message: "are you logged in?",
      });
    }

    // Push the userId into the current user's friendlist
    const updatedLoggedUser = await User.findByIdAndUpdate(
      req.user.userId,
      req.body.areFriends
        ? { $push: { friendList: userId } }
        : { $pull: { friendList: userId } },
      { new: true } // Return the updated user object
    );

    // Push the userId into the current user's friendlist
    const updatedFriend = await User.findByIdAndUpdate(
      userId,
      req.body.areFriends
        ? { $push: { friendList: currentUser._id } }
        : { $pull: { friendList: currentUser._id } },
      { new: true } // Return the updated user object
    );

    if (!updatedFriend) {
      return res.status(400).json({ message: "Error updating friendlist" });
    }

    // Check if the other user is in the current user's friend list
    const areFriends = updatedLoggedUser.friendList.some(
      (friend) => friend._id.toString() === userId
    );
    const updatedFriendResponse = user.toObject();
    updatedFriendResponse.areFriends = areFriends;
    console.log(updatedFriendResponse);
    // Send the response to the client
    return res.status(200).json({
      message: "User profile fetched successfully.",
      user: updatedFriendResponse,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
});

module.exports = router;
