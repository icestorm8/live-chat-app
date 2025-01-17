const express = require("express"); // for using express
const http = require("http");
const socketIo = require("socket.io");
const mongoose = require("mongoose"); // for using the mongodb cloud db
const cors = require("cors"); // Import cors
const dotenv = require("dotenv"); // for using the env variables
const userRoutes = require("./routes/UserRoutes");
const chatRoutes = require("./routes/ChatRoutes");
const messageRouts = require("./routes/MessageRoutes");
// Initialize dotenv to access environment variables
dotenv.config();

// Set up your express server and socket.io
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// allow cors only to cetain origins
const corsOptions = {
  origin: process.env.CLIENT, // Allow only this origin
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "Accept",
    "X-Requested-With",
    "XMLHttpRequest ",
  ],
};

app.use(cors(corsOptions));

// Middleware
app.use(express.json()); // Parse incoming JSON requests
app.use(express.urlencoded({ extended: true })); // parse incoming requests with URL-encoded payloads, which are typically sent by HTML forms when the method is POST or PUT.
app.use("/api/users", userRoutes); // user routes
app.use("/api/messages", messageRouts); // chat routes
app.use("/api/chats", chatRoutes); // chat routes

// Socket.IO connection event
io.on("connection", (socket) => {
  console.log("User connected");

  // Event to join a specific chat room (using chatId)
  socket.on("joinChat", (chatId) => {
    socket.join(chatId); // Join the room corresponding to the chatId
  });

  // Event to send a new message
  socket.on("sendMessage", async (messageData) => {
    const { chatId, content, senderId } = messageData;

    // Save message to the database
    const message = new Message({
      chatId,
      sender: senderId,
      content,
    });

    await message.save();

    // Emit the new message to the chat room
    io.to(chatId).emit("newMessage", message);
  });

  // Event for "typing" status
  socket.on("typing", (chatId, userId) => {
    socket.to(chatId).emit("typing", userId); // Notify other users in the chat
  });

  // On disconnect
  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

// Example route
app.get("/", (req, res) => {
  res.send("Hello, Express!");
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
