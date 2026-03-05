import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import User from "./models/User.js";
import Comment from "./models/comment.js";
import Like from "./models/Likes.js";
// Initialize Express app
const app = express();

// Load environment variables
dotenv.config();

// Middleware
app.use(
  cors({
    origin: [
      "https://hfc-youth-ministry.netlify.app",
      "http://localhost:5173",
      "http://localhost:3000",
    ],
    credentials: true,
  }),
);
app.use(express.json());

// Basic test route
app.get("/api/test", (req, res) => {
  res.json({ message: "✅ Backend server is working!" });
});

// ✅✅✅ ADD THESE LINES - Import and use the contact routes ✅✅✅
import contactRoutes from "./routes/contactRoutes.js";
app.use("/api/contact", contactRoutes);

// ✅✅✅ ADD THESE LINES - Import and use the joinUs routes ✅✅✅
import joinUsRoutes from "./routes/joinUsRoutes.js";
app.use("/api/joinus", joinUsRoutes);

// MongoDB Connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Connected");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1);
  }
};

// Start Server
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`🔗 Test it at: http://localhost:${PORT}/api/test`);
  });
};

// User registration
app.post("/api/users/register", async (req, res) => {
  try {
    const { name, email, phone } = req.body;

    // Basic validation
    if (!name || !email) {
      return res.status(400).json({ error: "Name and email are required" });
    }

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(200).json({ user, message: "User already exists" });
    }

    // Create new user
    user = new User({ name, email, phone });
    await user.save();

    res.status(201).json({ user });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Get user by email (login)
app.post("/api/users/login", async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({ user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET comments for a post
app.get("/api/posts/:postId/comments", async (req, res) => {
  try {
    const comments = await Comment.find({ postId: req.params.postId })
      .populate("userId", "name")
      .sort({ createdAt: -1 });
    res.json(comments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST a new comment
app.post("/api/posts/:postId/comments", async (req, res) => {
  try {
    const { userId, text } = req.body;
    if (!userId || !text) {
      return res.status(400).json({ error: "userId and text required" });
    }
    const comment = new Comment({
      postId: req.params.postId,
      userId,
      text,
    });
    await comment.save();
    await comment.populate("userId", "name");
    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET like count and status for a post
app.get("/api/posts/:postId/likes", async (req, res) => {
  try {
    const count = await Like.countDocuments({ postId: req.params.postId });
    const { userId } = req.query;
    let liked = false;
    if (userId) {
      const like = await Like.findOne({ postId: req.params.postId, userId });
      liked = !!like;
    }
    res.json({ count, liked });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Toggle like (add or remove)
app.post("/api/posts/:postId/likes/toggle", async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({ error: "userId required" });
    }
    const existing = await Like.findOne({ postId: req.params.postId, userId });
    if (existing) {
      await existing.deleteOne();
      res.json({ liked: false });
    } else {
      const like = new Like({ postId: req.params.postId, userId });
      await like.save();
      res.json({ liked: true });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start the application
startServer();
