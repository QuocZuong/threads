import express from "express";
import {
  createPost,
  getPost,
  deletePost,
  likeUnlikePost,
  replyToPost,
  getFeedPost,
  getUserPost,
  searchPost,
} from "../controllers/postController.js";
import protectRoute from "../middlewares/protectRoute.js";
import errorHanlder from "../middlewares/errorHanlder.js";

const router = express.Router();
router.get("/feed", protectRoute, getFeedPost);
router.get("/search", searchPost);
router.post("/", protectRoute, createPost);
router.get("/:id", getPost); // get all posts
router.get("/user/:username", protectRoute, getUserPost); // get user's posts
router.delete("/:id", protectRoute, deletePost);
router.put("/like/:id", protectRoute, likeUnlikePost);
router.put("/reply/:id", protectRoute, replyToPost);
router.all("*", errorHanlder);

export default router;
