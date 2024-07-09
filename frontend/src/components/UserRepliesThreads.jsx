import { CommentWithActions } from "./Comment";
import { Box, Flex, Spinner } from "@chakra-ui/react";
import useGetUserComments from "../hooks/useGetUserComment";

const UserRepliesThreads = () => {
  const { isLoading, comments } = useGetUserComments();

  if (isLoading) {
    return (
      <Flex justifyContent={"center"} my={12}>
        <Spinner size={"xl"} />
      </Flex>
    );
  }

  if (!comments) {
    return null;
  }

  if (comments.length === 0) {
    return (
      <div className="user-message">
        <h1>There are no comments yet</h1>
      </div>
    );
  }

  return (
    <Box pt={3}>
      {comments.map((c) => (
        <CommentWithActions
          key={c._id}
          reply={c}
          lastReply={c._id === comments[comments.length - 1]._id}
          isHidingReplies={true}
        />
      ))}
    </Box>
  );
};

export default UserRepliesThreads;
