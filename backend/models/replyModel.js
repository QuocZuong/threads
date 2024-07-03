import mongoose from "mongoose";

/**
 * The schema for `Reply` model.
 */
export const replySchema = mongoose.Schema(
  {
    /** The user who created the reply. */
    userId: {
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

replySchema.add({
  /** An array of replies inside of the reply, allowing a recursive structure. */
  replies: [replySchema],
});

/**
 * A reply of a Post.
 */
const Reply = mongoose.model("Reply", replySchema);

export default Reply;
