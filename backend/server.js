import express from "express";
import connectDB from "./db/connectDB.js";

connectDB();

const app = express();

const PORT = process.env.PORT || 5050;

app.get("/", (req, res) => {
    res.send("h1");
});

app.listen(PORT, () => {
    console.log(`Hey server started at port ${PORT}!`);
});
