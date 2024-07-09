import express from "express";
import { likeOrUnlike, reply, update, remove, getComment, getUserComments } from "../controllers/commentController.js";
import protectRoute from "../middlewares/protectRoute.js";

/**
 * A router that handle interactions with post's comments.
 */
const router = express.Router();

router.use(protectRoute);

router.get("/:id", getComment);
router.get("/user/:userId", getUserComments);
router.post("/reply/:id", reply);
router.put("/like/:id", likeOrUnlike);
router.put("/:id", update);
router.delete("/:id", remove);

export default router;
