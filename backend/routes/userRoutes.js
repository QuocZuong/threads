import express from "express";
import {
    getUserProfile,
    signupUser,
    loginUser,
    logoutUser,
    followUnFollowUser,
    updateUser,
    searchUser,
} from "../controllers/userController.js";
import protectRoute from "../middlewares/protectRoute.js";
import errorHanlder from "../middlewares/errorHanlder.js";

const router = express.Router();

router.get("/search", searchUser);
router.get("/:query", getUserProfile);
router.post("/signup", signupUser);
router.post("/login", loginUser);
router.post("/logout", protectRoute, logoutUser);
router.post("/follow/:id", protectRoute, followUnFollowUser); // id of the user to follow/unfollow
router.patch("/:id", protectRoute, updateUser);
router.all("*", errorHanlder);

export default router;
