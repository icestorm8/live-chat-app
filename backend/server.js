const express = require("express"); // for using express
const mongoose = require("mongoose"); // for using the mongodb cloud db
const dotenv = require("dotenv"); // for using the env variables
const userRoutes = require("./routes/UserRoutes");
// Initialize dotenv to access environment variables
dotenv.config();

const app = express();

// Middleware
// app.use(express.json()); // Parse incoming JSON requests
app.use("/api", userRoutes); // user routes
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
