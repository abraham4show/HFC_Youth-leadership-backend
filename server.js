import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

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
  })
);
app.use(express.json());

// Basic test route
app.get("/api/test", (req, res) => {
  res.json({ message: "✅ Backend server is working!" });
});

// ✅✅✅ ADD THESE LINES - Import and use the contact routes ✅✅✅
import contactRoutes from "./routes/contactRoutes.js";
app.use("/api/contact", contactRoutes);

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

// Start the application
startServer();
