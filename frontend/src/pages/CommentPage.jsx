import { Flex, Text, Image, Box, Divider, Spinner } from "@chakra-ui/react";
import { Avatar } from "@chakra-ui/avatar";
import { useNavigate } from "react-router-dom";
import { CommentWithActions } from "../components/Comment";
import useGetUserProfile from "../hooks/useGetUserProfile";
import { formatDistanceToNow } from "date-fns";
import useGetComment from "../hooks/useGetComment";
import CommentActions from "../components/CommentActions";

const CommentPage = () => {
  const { user, isLoading: isLoadingUser } = useGetUserProfile();
  const { comment: currentComment, isLoading: isLoadingComment } = useGetComment();
  const navigate = useNavigate();

  const handleNavigate = (e) => {
    e.preventDefault();
    navigate(`/${user.username}`);
  };

  if ((!user && isLoadingUser) || (!currentComment && isLoadingComment)) {
    return (
      <Flex justifyContent={"center"}>
        <Spinner size={"xl"} />
      </Flex>
    );
  }

  if (!currentComment) {
    return null;
  }

  return (
    <>
      <Flex>
        <Flex w={"full"} alignItems={"center"} gap={3}>
          <Avatar
            src={user?.profilePic}
            size={"md"}
            name={user?.username}
            cursor={"pointer"}
            onClick={handleNavigate}
          />
          <Flex>
            <Text
              fontSize={"sm"}
              fontWeight={"bold"}
              cursor={"pointer"}
              onClick={handleNavigate}
              _hover={{ textDecor: "underline" }}
            >
              {user?.username}
            </Text>
            <Image src="/verified.png" w={4} height={4} ml={3}></Image>
          </Flex>
        </Flex>
        <Flex gap={4} alignItems={"center"}>
          <Text fontSize={"xs"} width={48} textAlign={"right"} color={"gray.light"}>
            {formatDistanceToNow(new Date(currentComment?.createdAt))} ago
          </Text>
        </Flex>
      </Flex>
      <Text my={3}>{currentComment.text}</Text>
      {currentComment.img && (
        <Box borderRadius={6} overflow={"hidden"} border={"1px solid"} borderColor={"gray.light"}>
          <Image src={currentComment?.img} w={"full"} />
        </Box>
      )}
      <Flex gap={3} my={3}>
        <CommentActions comment={currentComment} />
      </Flex>
      {currentComment.comments.length > 0 && <Divider my={4} />}
      {currentComment.comments.map((c) => {
        return (
          <CommentWithActions
            key={c._id}
            reply={c}
            lastReply={c._id === currentComment.comments[currentComment.comments.length - 1]._id}
          />
        );
      })}
    </>
  );
};

export default CommentPage;
