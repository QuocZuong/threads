import Comment from "../models/commentModel.js";
import { removeImage, uploadImage } from "../utils/helpers/imageUploader.js";

/**
 * Retrieve a comment by its id.
 *
 */
export const getComment = async (req, res, next) => {
  try {
    const { id: commentId } = req.params;
    const comment = await Comment.findById(commentId)
      .populate(["comments", "postedBy"])
      .populate({ path: "comments", populate: ["postedBy", "comments"] })
      .populate("repliedPost")
      .populate("repliedComment");

    if (!comment) return res.status(404).json({ error: "Comment not found" });

    res.status(200).json(comment);
  } catch (error) {
    next(error);
  }
};

/**
 * Get all comemnts created by a user.
 */
export const getUserComments = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const comments = await Comment.find({ postedBy: userId })
      .populate(["comments", "postedBy"])
      .populate({ path: "comments", populate: ["postedBy", "comments"] })
      .populate("repliedComment");

    res.status(200).json(comments);
  } catch (error) {
    next(error);
  }
};

/**
 * Reply to an existing comment.
 */
export const reply = async (req, res, next) => {
  let isUploadedImage = false;
  let imgUrl = "";

  try {
    const { text } = req.body;
    let { img } = req.body;
    const { id: commentId } = req.params;
    const userId = req.user._id;
    const userProfilePic = req.user.profilePic;
    const username = req.user.username;
    const maxLength = 500;

    if (!text) return res.status(400).json({ error: "Text is required" });
    if (text.length > maxLength)
      return res.status(400).json({ error: `Text must be less than or equal ${maxLength} characters` });

    const parentComment = await Comment.findById(commentId);
    if (!parentComment) return res.status(404).json({ error: "Comment not found" });

    if (img) {
      imgUrl = await uploadImage(img);
      isUploadedImage = true;
    }

    const comment = await Comment.create({
      postedBy: userId,
      repliedPost: parentComment.repliedPost,
      repliedComment: parentComment._id,
      text,
      img: imgUrl,
      username,
      userProfilePic,
    });

    parentComment.comments.push(comment._id);
    await parentComment.save();

    res.status(201).json(comment);
  } catch (error) {
    if (isUploadedImage) await removeImage(imgUrl);
    next(error);
  }
};

/**
 * Like (or unlike) a comment.
 */
export const likeOrUnlike = async (req, res, next) => {
  try {
    const { id: commentId } = req.params;
    const comment = await Comment.findById(commentId);
    const userId = req.user._id;

    if (!comment) return res.status(404).json({ error: "Comment not found" });

    if (comment.likes.includes(userId)) {
      await Comment.updateOne({ _id: commentId }, { $pull: { likes: userId } });
      res.status(200).json({ message: "Comment unliked successfully" });
    } else {
      comment.likes.push(userId);
      await comment.save();
      res.status(200).json({ message: "Comment liked successfully" });
    }
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a comment.
 */
export const remove = async (req, res, next) => {
  try {
    const { id: commentId } = req.params;
    const userId = req.user._id;
    const comment = await Comment.findById(commentId);

    if (!comment) return res.status(404).json({ error: "Comment not found" });
    if (comment.userId !== userId) return res.status(401).json({ error: "Unauthorized" });

    await comment.remove();
  } catch (error) {
    next(error);
  }
};

/**
 *  Update a comment.
 */
export const update = async (req, res, next) => {
  let imgUrl = "";

  try {
    const { id: commentId } = req.params;
    const userId = req.user._id;
    const { text } = req.body;
    let { img } = req.body;
    const comment = await Comment.findById(commentId);

    if (!comment) return res.status(404).json({ error: "Comment not found" });
    if (comment.userId !== userId) return res.status(401).json({ error: "Unauthorized" });

    if (img) {
      imgUrl = await uploadImage(img);
      if (comment.img !== "") await removeImage(comment.img);
    }

    comment.text = text;
    comment.img = imgUrl;

    await comment.save();
  } catch (error) {
    next(error);
  }
};
