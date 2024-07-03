import express from "express";
import { likeReply, replyToReply } from "../controllers/replyController.js";
import protectRoute from "../middlewares/protectRoute.js";

/**
 * A router that handle interactions with post's reply.
 */
const router = express.Router();

router.use(protectRoute);
router.post("/reply/:id", replyToReply);
router.put("/like/:id", likeReply);

export default router;
