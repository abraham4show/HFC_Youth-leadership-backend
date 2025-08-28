import express from "express";
import JoinUs from "../models/JoinUs.js";

const router = express.Router();

// In your backend route
router.post("/", async (req, res) => {
  try {
    console.log("📥 Incoming data:", req.body);

    // Validate required fields
    if (!req.body.firstName || !req.body.lastName || !req.body.email) {
      return res.status(400).json({
        error: "Missing required fields",
        details: "First name, last name, and email are required",
      });
    }

    // Force convert age to a number
    const newApplication = new JoinUs({
      ...req.body,
      age: Number(req.body.age),
    });

    await newApplication.save();

    console.log("✅ Application saved successfully");
    res.status(201).json({
      message: "✅ Application submitted successfully",
      id: newApplication._id, // Include the ID for reference
    });
  } catch (err) {
    console.error("❌ Error saving JoinUs form:", err);
    res.status(500).json({
      error: "❌ Failed to submit application",
      details: err.message,
    });
  }
});

export default router;
