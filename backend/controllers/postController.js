import Post from "../models/postModel.js";
import User from "../models/userModel.js";
import mongoose from "mongoose";

const createPost = async (req, res) => {
    const maxLength = 500;
    try {
        const { postedBy, text, img } = req.body;

        if (!postedBy || !text) return res.status(400).json({ message: "Posted by and text are required" });

        const user = await User.findById(postedBy);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // compare if the user who is creating the post is the same as the user who is logged in
        if (user._id.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: "Unauthorized to create post" });
        }

        if (text.length > maxLength)
            return res.status(400).json({ message: `Text must be less than ${maxLength} characters` });

        const newPost = new Post({
            postedBy,
            text,
            img,
        });

        await newPost.save();

        res.status(201).json({ message: "Post created", newPost });
    } catch (error) {
        res.status(500).json({ message: error.message });
        console.log("error in createPost user " + error.message);
    }
};

const getPost = async (req, res) => {
    try {
        const id = req.params.id;

        // // check if the id and send user to not found page
        // if (!mongoose.Types.ObjectId.isValid(id)) {
        //     return res.redirect("/not-found");
        // }

        const post = await Post.findById(id);

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        return res.status(200).json({ message: "Post found!", post });
    } catch (error) {
        res.status(500).json({ message: error.message });
        console.log("error in getPost user " + error.message);
    }
};

const deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) return res.status(404).json({ message: "Post not found" });

        if (post.postedBy.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: "Unauthorized to delete post" });
        }

        await Post.findByIdAndDelete(post._id);
        return res.status(200).json({ message: "Post deleted" });
    } catch (error) {
        res.status(500).json({ message: error.message });
        console.log("error in deletePost user " + error.message);
    }
};

export { createPost, getPost, deletePost };
