import React, { useState, useEffect } from "react";
import { Box, Button, Flex, Text } from "@chakra-ui/react";
import Conversation from "../components/Conversation";
import {
  useQuery,
  useQueries,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { useGetAllConversations } from "../api/conversation.api";
import { useRecoilState, useRecoilValue } from "recoil";
import { conversationsAtom } from "../atoms/messagesAtom";
import ConversationContainer from "../components/ConversationContainer";

const ChatPage = () => {
  const [conversations, setConversations] = useRecoilState(conversationsAtom);

  const { isLoading, error, data: conversationsResponse } = useGetAllConversations();

  useEffect(() => {
    setConversations(conversationsResponse);
  }, [conversationsResponse, setConversations]);

  return (
    <Box>
      <Flex justifyContent="center" height="100vh">
        <Box flex={30}>
          {conversations?.map((conversation) => {
            console.log("conversation in chat page", conversation);
            return <Conversation key={conversation?._id} conversation={conversation} />;
          })}
        </Box>
        <Box flex={70}>
          <ConversationContainer />
        </Box>
      </Flex>
    </Box>
  );
};

export default ChatPage;
