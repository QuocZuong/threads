import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

/**
 * @desc    Protect route from unauthorized access
 */
const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;

        if (!token) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId).select("-password");

        req.user = user;

        next();
    } catch (error) {
        res.status(500).json({ message: error.message });
        console.log("error in protectRoute" + error.message);
    }
};

export default protectRoute;
