import express from "express";
import { signupUser, loginUser, logoutUser, followUnFollowUser } from "../controllers/userController.js";
import protectRoute from "../middlewares/protectRoute.js";

const router = express.Router();

router.post("/signup", signupUser);
router.post("/login", loginUser);
router.post("/logout", protectRoute, logoutUser);
router.post("/follow/:id", protectRoute, followUnFollowUser);

export default router;
