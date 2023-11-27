import { v2 as cloudinary } from "cloudinary";
import Post from "../models/postModel.js";
import User from "../models/userModel.js";

const createPost = async (req, res) => {
    const maxLength = 500;

    try {
        const { postedBy, text } = req.body;
        let { img } = req.body;

        if (!postedBy || !text) return res.status(400).json({ error: "Posted by and text are required" });

        const user = await User.findById(postedBy);

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // compare if the user who is creating the post is the same as the user who is logged in
        if (user._id.toString() !== req.user._id.toString()) {
            return res.status(401).json({ error: "Unauthorized to create post" });
        }

        if (text.length > maxLength)
            return res.status(400).json({ error: `Text must be less than ${maxLength} characters` });

        if (img) {
            const uploadedResponse = await cloudinary.uploader.upload(img);
            img = uploadedResponse.secure_url;
        }

        const newPost = new Post({
            postedBy,
            text,
            img,
        });

        await newPost.save();

        res.status(201).json({ message: "Post created", newPost });
    } catch (error) {
        res.status(500).json({ error: error.message });
        console.log("error in createPost  " + error.message);
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
            return res.status(404).json({ error: "Post not found" });
        }

        return res.status(200).json({ message: "Post found!", post });
    } catch (error) {
        res.status(500).json({ error: error.message });
        console.log("error in getPost  " + error.message);
    }
};

const deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) return res.status(404).json({ error: "Post not found" });

        if (post.postedBy.toString() !== req.user._id.toString()) {
            return res.status(401).json({ error: "Unauthorized to delete post" });
        }

        if (post.img) {
            const imgId = post.img.split("/").pop().split(".")[0];
            await cloudinary.uploader.destroy(imgId);
        }

        await Post.findByIdAndDelete(post._id);
        return res.status(200).json({ message: "Post deleted" });
    } catch (error) {
        res.status(500).json({ error: error.message });
        console.log("error in deletePost " + error.message);
    }
};

const likeUnlikePost = async (req, res) => {
    try {
        const { id: postId } = req.params;
        const userId = req.user._id;

        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }

        const isUserLikedPost = post.likes.includes(userId);

        // if user already liked the post then unlike it
        if (isUserLikedPost) {
            await Post.updateOne({ _id: postId }, { $pull: { likes: userId } });
            res.status(200).json({ message: "Post unliked successfully" });
        }
        // if user didn't like the post then like it
        else {
            post.likes.push(userId);
            await post.save();
            res.status(200).json({ message: "Post liked successfully" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
        console.log("error in likeUnLikePost post " + error.message);
    }
};

const replyToPost = async (req, res) => {
    try {
        const { text } = req.body;
        const postId = req.params.id;
        const userId = req.user._id;
        const userProfilePic = req.user.profilePic;
        const username = req.user.username;

        if (!text) return res.status(400).json({ error: "Text is required" });

        const post = await Post.findById(postId);

        if (!post) return res.status(404).json({ error: "Post not found" });

        const reply = {
            userId,
            text,
            userProfilePic,
            username,
        };

        post.replies.push(reply);
        await post.save();

        res.status(200).json({ message: "Reply added successfully", post });
    } catch (error) {
        res.status(500).json({ error: error.message });
        console.log("error in replyToPost " + error.message);
    }
};

const getFeedPost = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId);

        if (!user) return res.status(404).json({ error: "User not found" });

        const following = user.following;

        // get posts of the users that the logged in user is following and his posts
        const feedPosts = await Post.find({ postedBy: { $in: [...following, userId] } }).sort({ createdAt: -1 });
        res.status(200).json(feedPosts);
    } catch (error) {
        res.status(500).json({ error: error.message });
        console.log("error in replyToPost " + error.message);
    }
};

const getUserPost = async (req, res) => {
    try {
        const { username } = req.params;

        const user = await User.findOne({ username });

        if (!user) return res.status(404).json({ error: "User not found" });

        const posts = await Post.find({ postedBy: user._id }).sort({ createdAt: -1 });

        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ error: error.message });
        console.log("error in getUserPost " + error.message);
    }
};

export { createPost, getPost, deletePost, likeUnlikePost, replyToPost, getFeedPost, getUserPost };
