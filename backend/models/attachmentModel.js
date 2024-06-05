import mongoose from "mongoose";

const attachmentSchema = mongoose.Schema(
  {
    messageId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
    fileName: {
      type: String,
      required: true,
    },
    fileUrl: {
      type: String,
    },
    fileType: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const Attachment = mongoose.model("Attachment", attachmentSchema);

export default Attachment;
