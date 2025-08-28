import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();

// Middleware
app.use(
  cors({
    origin: "http://localhost:5173", // Your React app's URL
    credentials: true,
  })
);
app.use(express.json()); // allows us to accept JSON

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
