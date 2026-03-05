import mongoose from "mongoose";

const LikeSchema = new mongoose.Schema({
  postId: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now },
});

// Ensure one like per user per post
LikeSchema.index({ postId: 1, userId: 1 }, { unique: true });

const Like = mongoose.model("Like", LikeSchema);
export default Like;
