const express = require("express"); // for using express
const mongoose = require("mongoose"); // for using the mongodb cloud db
const cors = require("cors"); // Import cors
const dotenv = require("dotenv"); // for using the env variables
const userRoutes = require("./routes/UserRoutes");

// Initialize dotenv to access environment variables
dotenv.config();

const app = express();
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
app.use("/api/users", userRoutes); // user routes
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
