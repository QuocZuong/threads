import Post from "../models/postModel.js";
import User from "../models/userModel.js";

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
    } catch (error) {
        res.status(500).json({ message: error.message });
        console.log("error in getPost user " + error.message);
    }
};

export { createPost, getPost };
