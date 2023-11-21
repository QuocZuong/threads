import mongoose from "mongoose";

const postSchema = mongoose.Schema(
    {
        postedBy: {
            // this is the id will be generated randomly by mongodb and it from the user model
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        text: {
            type: String,
            required: true,
        },
        img: {
            type: String,
        },
        likes: {
            type: Number,
            default: 0,
        },
        replies: [
            {
                userId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User",
                    required: true,
                },
                text: {
                    type: String,
                    required: true,
                },
                userProfilePic: {
                    type: String,
                },
                username: {
                    type: String,
                },
            },
        ],
    },
    {
        timestamps: true,
    },
);

const Post = mongoose.model("Post", postSchema);

export default Post;
