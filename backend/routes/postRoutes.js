import express from "express";
import { createPost, getPost, deletePost, likeUnlikePost } from "../controllers/postController.js";
import protectRoute from "../middlewares/protectRoute.js";

const router = express.Router();
router.post("/", protectRoute, createPost);
router.get("/:id", protectRoute, getPost);
router.delete("/:id", protectRoute, deletePost);
router.post("/like/:id", protectRoute, likeUnlikePost);

export default router;
