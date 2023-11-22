import express from "express";
import connectDB from "./db/connectDB.js";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/userRoutes.js";
import postRoutes from "./routes/postRoutes.js";

connectDB();

const app = express();

const PORT = process.env.PORT || 5050;

app.use(express.json()); // to parse json data from req.body
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); // to parse cookies from req.cookies

// Routes
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);

app.listen(PORT, () => {
    console.log(`Hey server started at port ${PORT}!`);
});
