import mongoose from "mongoose";

const messageSchema = mongoose.Schema(
    {
        conversationId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Conversation",
        },
        senderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            message: String,
        },
        content: {
            type: String,
            required: true,
        },
        type: {
            type: String,
            default: "text",
        },
    },
    {
        timestamps: true,
    },
);

const Message = mongoose.model("Message", messageSchema);

export default Message;
