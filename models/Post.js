import mongoose from "mongoose";

const PostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    user: {
      type: String,
      required: true,
    },
    likes: {
      type: [String],
      default: [],
    },
    comments: [
      {
        text: {
          type: String,
          required: true,
        },
        user: {
          type: String,
          required: true,
        },
        commentid: {
          type: String,
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);
export default mongoose.model("Post", PostSchema);
