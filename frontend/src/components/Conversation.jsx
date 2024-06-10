import React from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import { selectedConversationAtom } from "../atoms/messagesAtom";
import { Box, Button, Flex, Text } from "@chakra-ui/react";

const Conversation = ({ conversation }) => {
  const senderUser = conversation?.participants?.[0];
  const receiverUser = conversation?.participants?.[1];
  const user = useRecoilValue(userAtom);
  const [selectedConversation, setSelectedConversation] = useRecoilState(selectedConversationAtom);

  return (
    <Box
      onClick={() => {
        setSelectedConversation({
          _id: conversation?._id,
          userId: senderUser?._id,
          username: senderUser?.username,
          userProfilePic: senderUser?.profilePic,
        });
      }}
    >
      <Text>{conversation?.participants?.find((participant) => participant?._id !== user?._id)?.name}</Text>
    </Box>
  );
};

export default Conversation;
