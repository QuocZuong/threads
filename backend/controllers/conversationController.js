import Conversation from "../models/conversationModel.js";

const getConversationById = async (req, res) => {
  try {
    const { conversationId } = req.params;

    const conversation = await Conversation.findById(conversationId).lean();

    if (!conversation) {
      return res.status(404).json({ error: "Conversation not found" });
    }

    res.status(200).json(conversation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getConversationByParticipants = async (req, res) => {
  try {
    const userId = req.user._id;
    const conversation = await Conversation.find({
      participants: userId,
    }).populate({
      path: "participants",
      select: "name username profilePic",
    });

    res.status(200).json(conversation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export { getConversationById, getConversationByParticipants };
