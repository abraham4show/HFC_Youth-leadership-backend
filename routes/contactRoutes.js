import express from "express";
import Contact from "../models/Contact.js";

const router = express.Router();

// POST /api/contact
router.post("/", async (req, res) => {
  try {
    console.log("📥 Contact form data:", req.body);
    const newMessage = new Contact(req.body);
    await newMessage.save();
    res.status(201).json({ message: "✅ Message saved successfully" });
  } catch (err) {
    console.error("❌ Error saving contact:", err);
    res.status(500).json({ error: "Failed to send message" });
  }
});

export default router;
