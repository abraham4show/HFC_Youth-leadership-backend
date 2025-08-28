import mongoose from "mongoose";

const joinUsSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    age: { type: Number, required: true, min: 13, max: 40 },
    church: { type: String },
    involvement: {
      type: String,
      enum: ["member", "volunteer", "leader"],
      required: true,
    },
    interests: { type: [String], default: [] },
    experience: { type: String },
    goals: { type: String },
    agreement: { type: Boolean, required: true },
    updates: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("JoinUs", joinUsSchema, "joinus");
