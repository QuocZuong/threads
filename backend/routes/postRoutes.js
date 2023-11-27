import express from "express";
import {
    createPost,
    getPost,
    deletePost,
    likeUnlikePost,
    replyToPost,
    getFeedPost,
    getUserPost,
} from "../controllers/postController.js";
import protectRoute from "../middlewares/protectRoute.js";

const router = express.Router();
router.get("/feed", protectRoute, getFeedPost);
router.post("/", protectRoute, createPost);
router.get("/:id", getPost); // get all posts
router.get("/user/:username", protectRoute, getUserPost); // get user's posts
router.delete("/:id", protectRoute, deletePost);
router.put("/like/:id", protectRoute, likeUnlikePost);
router.put("/reply/:id", protectRoute, replyToPost);

export default router;
