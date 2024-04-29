import mongoose from "mongoose";

const conversationSchema = mongoose.Schema(
    {
        title: {
            // for group chat
            type: String,
        },
        participants: [
            {
                type: mongoose.Schema.ObjectId,
                ref: "User",
            },
        ],
        lastMessage: {
            content: String,
            sender: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        },
    },
    {
        timestamps: true,
    },
);

const Conversation = mongoose.model("Conversation", conversationSchema);

export default Conversation;
