import express from "express";
import protectRoute from "../middlewares/protectRoute.js";
import { getConversationById, getConversationByParticipants } from "../controllers/conversationController.js";
const router = express.Router();

router.get("/conversation/:conversationId", protectRoute, getConversationById);
router.get("/conversations", protectRoute, getConversationByParticipants);

export default router;
