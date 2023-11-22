import express from "express";
import { createPost, getPost } from "../controllers/postController.js";
import protectRoute from "../middlewares/protectRoute.js";

const router = express.Router();
router.post("/", protectRoute, createPost);
router.get("/:id", protectRoute, getPost);

export default router;
