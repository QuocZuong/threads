import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const generateTokenAndSetCookie = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "10d",
  });

  // set cookie
  res.cookie("jwt", token, {
    httpOnly: true,
    maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days
    sameSite: "strict",
  });

  return token;
};

export default generateTokenAndSetCookie;
