import express from "express";
import connectDB from "./db/connectDB.js";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/userRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import conversationRoutes from "./routes/conversationRoutes.js";
import { v2 as cloudinary } from "cloudinary";
import { app, server } from "./socket/socket.js";
import dotenv from "dotenv";
import morgan from "morgan";

dotenv.config();

connectDB();

const PORT = process.env.PORT || 5050;

// Cloudinary config
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Middleware
app.use(express.json({ limit: "10mb" })); // to parse json data from req.body
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser()); // to parse cookies from req.cookies
app.use(morgan("dev"));

// Routes
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api", conversationRoutes);
app.use("/api/messages", messageRoutes);

server.listen(PORT, () => {
    console.log(`Hey server started at port ${PORT}!`);
});
