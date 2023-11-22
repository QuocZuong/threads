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
            // array of user ids who liked the post
            type: [mongoose.Schema.Types.ObjectId],
            ref: "User",
            default: [],
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
