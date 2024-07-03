import Post from "../models/postModel.js";
import Reply from "../models/replyModel.js";

/**
 * Reply to an existing reply.
 */
export const replyToReply = async (req, res, next) => {
  try {
    const { text } = req.body;
    const { postId, replyId } = req.params;
    const userId = req.user._id;
    const userProfilePic = req.user.profilePic;
    const username = req.user.username;

    if (!text) return res.status(400).json({ error: "Text is required" });
    if (!(await Post.findById(postId))) return res.status(404).json({ error: "Post not found" });

    const parentReply = await Reply.findById(replyId);

    if (!parentReply) return res.status(404).json({ error: "Reply not found" });

    const reply = await Reply.create({
      userId,
      text,
      userProfilePic,
      username,
    });

    console.log("reply object created: ", reply);

    parentReply.replies.push(reply);
    await parentReply.save();

    res.status(200).json(reply);
  } catch (error) {
    next(error);
  }
};

/**
 * Like a reply.
 */
export const likeReply = async (req, res, next) => {
  try {
    const { replyId } = req.params;
    const reply = await Reply.findById(replyId);

    if (!reply) return res.status(404).json({ error: "Reply not found" });

    if (reply.likes.includes(req.user._id)) {
      reply.likes = reply.likes.filter((id) => id !== req.user._id);
    } else {
      reply.likes.push(req.user._id);
    }

    const result = await reply.save();

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export default { replyToReply };
