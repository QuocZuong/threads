import { Flex, Text, Divider, Box, VStack, Image } from "@chakra-ui/react";
import { Avatar } from "@chakra-ui/avatar";
import CommentActions from "./CommentActions";
import PropTypes from "prop-types";
import { formatDistanceToNow } from "date-fns";
import { useNavigate } from "react-router-dom";

const Comment = ({ reply, lastReply }) => {
  const navigate = useNavigate();

  const goToPosterPage = (e) => {
    e.preventDefault();
    navigate(`/${reply.username}`);
  };

  const goToCommentPage = (e) => {
    e.preventDefault();
    navigate(`/${reply.username}/comment/${reply._id}`);
  };

  return (
    <>
      <Flex gap={4} w={"full"}>
        <Avatar src={reply?.userProfilePic} name={reply?.username} cursor={"pointer"} onClick={goToPosterPage}></Avatar>
        <Flex gap={1} w={"full"} flexDirection={"column"}>
          <Flex w={"full"} justifyContent={"space-between"} alignItems={"center"}>
            <Text
              fontSize={"sm"}
              fontWeight={"bold"}
              cursor={"pointer"}
              onClick={goToPosterPage}
              _hover={{ textDecoration: "underline" }}
            >
              {reply?.username}
            </Text>
            <Text fontSize={"xs"} width={"auto"} textAlign={"left"} color={"gray.light"}>
              {formatDistanceToNow(new Date(reply.createdAt))} ago
            </Text>
          </Flex>

          <Box cursor={"pointer"} onClick={goToCommentPage}>
            <Text whiteSpace={"normal"} wordBreak={"break-word"}>
              {reply?.text}
            </Text>
            {reply.img && (
              <Box
                w={"20%"}
                mt={3}
                borderRadius={6}
                overflow={"hidden"}
                border={"1px solid"}
                borderColor={"gray.light"}
              >
                <Image src={reply.img} w={"full"} />
              </Box>
            )}
          </Box>
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
  const isSingleComment = reply.comments.length === 0;
  const navigate = useNavigate();

  const renderComment = (reply, isAddingVeticalDivier) => {
    const goToPosterPage = (e) => {
      e.preventDefault();
      navigate(`/${reply.username}`);
    };

    const goToCommentPage = (e) => {
      e.preventDefault();
      navigate(`/${reply.username}/comment/${reply._id}`);
    };

    return (
      <Flex gap={4} w={"full"} key={reply._id}>
        <Flex flexDir={"column"}>
          <Avatar
            src={reply?.userProfilePic}
            name={reply?.username}
            onClick={goToPosterPage}
            cursor={"pointer"}
          ></Avatar>
          {isAddingVeticalDivier && <Box w={0.5} minHeight={"20px"} h={"100%"} bg={"gray.light"} mt={2} ms={"23px"} />}
        </Flex>
        <Flex gap={1} w={"full"} flexDirection={"column"}>
          <Flex w={"full"} justifyContent={"space-between"} alignItems={"center"}>
            <Text
              fontSize={"sm"}
              fontWeight={"bold"}
              onClick={goToPosterPage}
              cursor={"pointer"}
              _hover={{ textDecor: "underline" }}
            >
              {reply?.username}
            </Text>
            <Text fontSize={"xs"} width={"auto"} textAlign={"left"} color={"gray.light"}>
              {formatDistanceToNow(new Date(reply.createdAt))} ago
            </Text>
          </Flex>
          <Box cursor={"pointer"} onClick={goToCommentPage}>
            <Text whiteSpace={"normal"} wordBreak={"break-word"}>
              {reply?.text}
            </Text>
            {reply.img && (
              <Box mt={3} borderRadius={6} overflow={"hidden"} border={"1px solid"} borderColor={"gray.light"}>
                <Image src={reply.img} w={"full"} />
              </Box>
            )}
          </Box>
          <CommentActions comment={reply} />
        </Flex>
      </Flex>
    );
  };

  return (
    <>
      <VStack spacing={"2"}>
        {renderComment(reply, !isSingleComment)}
        {!isSingleComment &&
          reply.comments.map((comment, index) => {
            const isLastReply = reply.comments.length - 1 === index;
            return renderComment(comment, !isLastReply);
          })}
      </VStack>
      {!lastReply ? <Divider my={4} /> : null}
    </>
  );
};

/**
 * Just the original `Comment` component with a vertical divider attached, is being used specifically for showing post as comment in the reply modal when user is replying to a post.
 *
 * @param {object} post The post object.
 * @param {object} postedBy The user who posted the post.
 *
 * @returns The JSX code for this component.
 */
export const PostAsCommentWithVerticalDivider = ({ post }) => {
  const postedBy = post.postedBy;
  const navigate = useNavigate();

  const goToPosterPage = (e) => {
    e.preventDefault();
    navigate(`/${postedBy.username}`);
  };

  return (
    <Flex gap={4} w={"full"}>
      <Flex flexDir={"column"}>
        <Avatar src={postedBy.profilePic} name={postedBy.username} cursor={"pointer"} onClick={goToPosterPage}></Avatar>
        <Box w={0.5} minHeight={"20px"} h={"100%"} bg={"gray.light"} my={2} ms={"23px"} />
      </Flex>
      <Flex gap={1} w={"full"} flexDirection={"column"}>
        <Flex w={"full"} justifyContent={"space-between"} alignItems={"center"}>
          <Text
            fontSize={"sm"}
            fontWeight={"bold"}
            cursor={"pointer"}
            onClick={goToPosterPage}
            _hover={{ textDecoration: "underline" }}
          >
            {postedBy.username}
          </Text>
          <Text fontSize={"xs"} width={"auto"} textAlign={"left"} color={"gray.light"}>
            {formatDistanceToNow(new Date(post.createdAt))} ago
          </Text>
        </Flex>
        <Text whiteSpace={"normal"} wordBreak={"break-word"}>
          {post.text}
        </Text>
        {post.img && (
          <Box
            w={"20%"}
            mt={3}
            mb={2}
            borderRadius={6}
            overflow={"hidden"}
            border={"1px solid"}
            borderColor={"gray.light"}
          >
            <Image src={post.img} w={"full"} />
          </Box>
        )}
      </Flex>
    </Flex>
  );
};

export const CommentWithVerticalDivider = ({ reply, lastReply }) => {
  const navigate = useNavigate();

  const goToPosterPage = (e) => {
    e.preventDefault();
    navigate(`/${reply.username}`);
  };

  return (
    <>
      <Flex gap={4} w={"full"}>
        <Flex flexDir={"column"}>
          <Avatar
            src={reply?.userProfilePic}
            name={reply?.username}
            cursor={"pointer"}
            onClick={goToPosterPage}
          ></Avatar>
          <Box w={0.5} minHeight={"20px"} h={"100%"} bg={"gray.light"} my={2} ms={"23px"} />
        </Flex>
        <Flex gap={1} w={"full"} flexDirection={"column"}>
          <Flex w={"full"} justifyContent={"space-between"} alignItems={"center"}>
            <Text
              fontSize={"sm"}
              fontWeight={"bold"}
              cursor={"pointer"}
              onClick={goToPosterPage}
              _hover={{ textDecoration: "underline" }}
            >
              {reply?.username}
            </Text>
            <Text fontSize={"xs"} width={"auto"} textAlign={"left"} color={"gray.light"}>
              {formatDistanceToNow(new Date(reply.createdAt))} ago
            </Text>
          </Flex>
          <Text whiteSpace={"normal"} wordBreak={"break-word"}>
            {reply?.text}
          </Text>
          {reply.img && (
            <Box
              w={"20%"}
              mt={3}
              mb={2}
              borderRadius={6}
              overflow={"hidden"}
              border={"1px solid"}
              borderColor={"gray.light"}
            >
              <Image src={reply.img} w={"full"} />
            </Box>
          )}
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

PostAsCommentWithVerticalDivider.propTypes = {
  post: PropTypes.object.isRequired,
};

CommentWithVerticalDivider.propTypes = {
  reply: PropTypes.object.isRequired,
  lastReply: PropTypes.bool.isRequired,
};

export default Comment;
