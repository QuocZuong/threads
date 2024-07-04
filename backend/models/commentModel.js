import mongoose from "mongoose";

/**
 * The schema for `Reply` model.
 */
export const commentSchema = mongoose.Schema(
  {
    /** The user who created the reply. */
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    /** An array of users' id who liked the reply. */
    likes: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
      default: [],
    },
    /** The reply's textual contents. */
    text: {
      type: String,
      required: true,
    },
    /** An attached image to the comment. */
    img: String,
    /** An array of comment inside of the comment, allowing a recursive structure. */
    comments: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Comment",
      default: [],
    },
    /** The username of the user who created the reply. */
    username: {
      type: String,
      required: true,
    },
    /** The profile picture link of the one who created the reply. It always show the lastest one. */
    userProfilePic: String,
  },
  {
    timestamps: true,
  },
);

/**
 * A reply of a Post.
 */
const Comment = mongoose.model("Comment", commentSchema);

export default Comment;
