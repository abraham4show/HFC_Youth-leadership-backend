import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema({
  postId: { type: String, required: true }, // Contentful entry ID
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Comment = mongoose.model("Comment", CommentSchema);
export default Comment;
