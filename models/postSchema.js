import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
  user_id: {
    type: String,
    required: true,
  },
});

const PostModel = mongoose.model("Post", postSchema);

export default PostModel;
