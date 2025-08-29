import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();

// Replace your current CORS configuration with this:
app.use(
  cors({
    origin: [
      "https://hfc-youth-ministry.netlify.app", // Your FRONTEND URL
      "http://localhost:3000", // Local development
    ],
    credentials: true,
  })
);
app.use(express.json()); // allows us to accept JSON

// Add these after CORS middleware
app.use((req, res, next) => {
  console.log("Incoming request from:", req.headers.origin);
  console.log("Request method:", req.method);
  console.log("Request path:", req.path);
  next();
});

// Add error handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(500).json({ error: "Something went wrong!" });
});

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Routes
import contactRoutes from "./routes/contactRoutes.js";
import joinUsRoutes from "./routes/joinUsRoutes.js";

app.use("/api/contact", contactRoutes);
app.use("/api/joinus", joinUsRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
