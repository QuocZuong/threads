import React from "react";
import { useRecoilValue } from "recoil";
import { selectedConversationAtom } from "../atoms/messagesAtom";
import { useGetMessages } from "../api/message.api";
import { Box, Button, Flex, Text } from "@chakra-ui/react";

const ConversationContainer = () => {
  const selectedConversation = useRecoilValue(selectedConversationAtom);
  const { isLoading, error, data } = useGetMessages(selectedConversation?.userId);

  return (
    <div>
      {data?.map((message) => {
        return <Text key={message?._id}>{message?.content}</Text>;
      })}
    </div>
  );
};

export default ConversationContainer;
