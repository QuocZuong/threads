import { Flex, Text, Divider, Box } from "@chakra-ui/react";
import { Avatar } from "@chakra-ui/avatar";
import CommentActions from "./CommentActions";
import PropTypes from "prop-types";
import { formatDistanceToNow } from "date-fns";

const Comment = ({ reply, lastReply }) => {
  return (
    <>
      <Flex gap={4} w={"full"}>
        <Avatar src={reply?.userProfilePic} name={reply?.username}></Avatar>
        <Flex gap={1} w={"full"} flexDirection={"column"}>
          <Flex w={"full"} justifyContent={"space-between"} alignItems={"center"}>
            <Text fontSize={"sm"} fontWeight={"bold"}>
              {reply?.username}
            </Text>
            <Text fontSize={"xs"} width={"auto"} textAlign={"left"} color={"gray.light"}>
              {formatDistanceToNow(new Date(reply.createdAt))} ago
            </Text>
          </Flex>
          <Text whiteSpace={"normal"} wordBreak={"break-word"}>
            {reply?.text}
          </Text>
        </Flex>
      </Flex>
      {!lastReply ? <Divider my={4} /> : null}
    </>
  );
};

/**
 * Just the original `Comment` component with the comment actions bar attached.
 *
 * @param {object} reply The reply object.
 * @param {boolean} lastReply Whether this is the last reply in the thread.
 *
 * @returns The JSX code for this component.
 */
export const CommentWithActions = ({ reply, lastReply }) => {
  return (
    <>
      <Flex gap={4} w={"full"}>
        <Avatar src={reply?.userProfilePic} name={reply?.username}></Avatar>
        <Flex gap={1} w={"full"} flexDirection={"column"}>
          <Flex w={"full"} justifyContent={"space-between"} alignItems={"center"}>
            <Text fontSize={"sm"} fontWeight={"bold"}>
              {reply?.username}
            </Text>
            <Text fontSize={"xs"} width={"auto"} textAlign={"left"} color={"gray.light"}>
              {formatDistanceToNow(new Date(reply.createdAt))} ago
            </Text>
          </Flex>
          <Text whiteSpace={"normal"} wordBreak={"break-word"}>
            {reply?.text}
          </Text>
          <CommentActions comment={reply} />
        </Flex>
      </Flex>
      {!lastReply ? <Divider my={4} /> : null}
    </>
  );
};

export const CommentWithHorizontalDivider = ({ reply, lastReply }) => {
  return (
    <>
      <Flex gap={4} w={"full"}>
        <Flex flexDir={"column"}>
          <Avatar src={reply?.userProfilePic} name={reply?.username}></Avatar>
          <Box w={0.5} minHeight={"20px"} h={"100%"} bg={"gray.light"} my={2} ms={"23px"} />
        </Flex>
        <Flex gap={1} w={"full"} flexDirection={"column"}>
          <Flex w={"full"} justifyContent={"space-between"} alignItems={"center"}>
            <Text fontSize={"sm"} fontWeight={"bold"}>
              {reply?.username}
            </Text>
            <Text fontSize={"xs"} width={"auto"} textAlign={"left"} color={"gray.light"}>
              {formatDistanceToNow(new Date(reply.createdAt))} ago
            </Text>
          </Flex>
          <Text whiteSpace={"normal"} wordBreak={"break-word"}>
            {reply?.text}
          </Text>
        </Flex>
      </Flex>
      {!lastReply ? <Divider my={4} /> : null}
    </>
  );
};

Comment.propTypes = {
  reply: PropTypes.object.isRequired,
  lastReply: PropTypes.bool.isRequired,
};

CommentWithActions.propTypes = {
  reply: PropTypes.object.isRequired,
  lastReply: PropTypes.bool.isRequired,
};

CommentWithHorizontalDivider.propTypes = {
  reply: PropTypes.object.isRequired,
  lastReply: PropTypes.bool.isRequired,
};

export default Comment;
