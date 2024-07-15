import { Flex, Text, Divider, Box, VStack, Image, useDisclosure } from "@chakra-ui/react";
import { Avatar } from "@chakra-ui/avatar";
import CommentActions from "./CommentActions";
import PropTypes from "prop-types";
import { formatDistanceToNow } from "date-fns";
import { useNavigate } from "react-router-dom";
import MenuActions from "./MenuActions";
import usePreviewImg from "../hooks/usePreviewImg";
import { createContext, useMemo, useState } from "react";
import useShowToast from "../hooks/useShowToast";
import { UpdateCommentModal } from "./UpdateModal";
import DeleteModal from "./DeleteModal";
import { DELETE_MODAL_TYPES } from "../constants/deleteModal.constants";
import { useTranslation } from "react-i18next";
import { t } from "i18next";

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
  const {t} = useTranslation();
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
              {formatDistanceToNow(new Date(reply.createdAt))} {t("ago")}
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
 * @param {boolean} isHidingReplies Whether this comment is showing child comments or not.
 *
 * @returns The JSX code for this component.
 */
export const CommentWithActions = ({ reply, lastReply, isHidingReplies }) => {
  const isSingleComment = reply.comments.length === 0;
  const isShowingDivider = !isHidingReplies && !isSingleComment;

  return (
    <>
      <VStack spacing={"2"}>
        <CommentItem comment={reply} isAddingVeticalDivider={isShowingDivider} />
        {isShowingDivider &&
          reply.comments.map((comment, index) => {
            const isLastReply = reply.comments.length - 1 === index;
            return <CommentItem key={comment._id} comment={comment} isAddingVeticalDivider={!isLastReply} />;
          })}
      </VStack>
      {!lastReply ? <Divider my={4} /> : null}
    </>
  );
};

/** The context for each comment's action menu. */
export const CommentActionsMenuContext = createContext(null);

/**
 * Small comment item for the `CommentWithActions` component.
 *
 * @param {Object} comment The commnent to render
 * @param {Boolean} isAddingVeticalDivider Whether to add a vertical divider or not.
 *
 * @returns The JSX code for this component.
 */
const CommentItem = ({ comment, isAddingVeticalDivider }) => {
  const [newText, setNewText] = useState(comment.text);
  const { handleImageChange, imgUrl, setImgUrl } = usePreviewImg(comment.img !== "" ? comment.img : null);
  const { isOpen: isUpdateModalOpen, onOpen: onUpdateModalOpen, onClose: onUpdateModalClose } = useDisclosure();
  const [isSubmiting, setIsSubmiting] = useState(false);
  const { isOpen: isDeleteModalOpen, onOpen: onDeleteModalOpen, onClose: onDeleteModalClose } = useDisclosure();
  const [isDeleting, setIsDeleting] = useState(false);

  const navigate = useNavigate();
  const showToast = useShowToast();

  const contextValue = useMemo(
    () => ({
      newText,
      setNewText,
      handleImageChange,
      imgUrl,
      setImgUrl,
    }),
    [handleImageChange, imgUrl, setImgUrl, newText, setNewText],
  );

  const goToPosterPage = (e) => {
    e.preventDefault();
    navigate(`/${comment.username}`);
  };

  const goToCommentPage = (e) => {
    e.preventDefault();
    navigate(`/${comment.username}/comment/${comment._id}`);
  };

  const handleCopyLink = async (e) => {
    e.preventDefault();

    const link = `${window.location.origin}/${comment.postedBy.username}/comment/${comment._id}`;

    try {
      await navigator.clipboard.writeText(link);
      showToast("Success", "Link copied!", "success");
    } catch (err) {
      showToast("Error", err, "error");
    }
  };

  const handleDelete = async (e) => {
    try {
      e.preventDefault();

      setIsDeleting(true);
      const res = await fetch("/api/comments/" + comment._id, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();

      if (data.error) {
        showToast("Error", data.error, "error");
        return;
      }

      showToast("Success", "Comment deleted", "success");
      onDeleteModalClose();
    } catch (error) {
      showToast("Error", error, "error");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      setIsSubmiting(true);
      const res = await fetch("/api/comments/" + comment._id, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: newText, img: imgUrl }),
      });
      const data = await res.json();

      if (data.error) {
        showToast("Error", data.error, "error");
        return;
      }

      showToast("Success", "Comment updated", "success");
      onUpdateModalClose();
    } catch (error) {
      showToast("Error", error, "error");
    } finally {
      setIsSubmiting(false);
    }
  };

  return (
    <CommentActionsMenuContext.Provider value={contextValue}>
      <Flex gap={4} w={"full"} key={comment._id}>
        <Flex flexDir={"column"}>
          <Avatar
            src={comment?.userProfilePic}
            name={comment?.username}
            onClick={goToPosterPage}
            cursor={"pointer"}
          ></Avatar>
          {isAddingVeticalDivider && <Box w={0.5} minHeight={"20px"} h={"100%"} bg={"gray.light"} mt={2} ms={"23px"} />}
        </Flex>
        <Flex gap={1} w={"full"} flexDirection={"column"}>
          <Flex w={"full"} justifyContent={"space-between"} alignItems={"center"}>
            <Flex gap={2}>
              <Text
                fontSize={"sm"}
                fontWeight={"bold"}
                onClick={goToPosterPage}
                cursor={"pointer"}
                _hover={{ textDecor: "underline" }}
              >
                {comment?.username}
              </Text>
              <Text fontSize={"xs"} width={"auto"} textAlign={"left"} color={"gray.light"}>
                {formatDistanceToNow(new Date(comment.createdAt))} {t("ago")}
              </Text>
            </Flex>
            <MenuActions
              poster={comment.postedBy}
              onCopyLink={handleCopyLink}
              onDelete={onDeleteModalOpen}
              onUpdate={true}
              onOpenUpdateModal={onUpdateModalOpen}
            />
            <DeleteModal
              isOpen={isDeleteModalOpen}
              onClose={onDeleteModalClose}
              onDelete={handleDelete}
              isLoading={isDeleting}
              type={DELETE_MODAL_TYPES.comment}
            />
          </Flex>
          <Box cursor={"pointer"} onClick={goToCommentPage}>
            <Text whiteSpace={"normal"} wordBreak={"break-word"}>
              {comment?.text}
            </Text>
            {comment.img && (
              <Box mt={3} borderRadius={6} overflow={"hidden"} border={"1px solid"} borderColor={"gray.light"}>
                <Image src={comment.img} w={"full"} />
              </Box>
            )}
          </Box>
          <CommentActions comment={comment} />
        </Flex>
      </Flex>
      <UpdateCommentModal
        isOpen={isUpdateModalOpen}
        onClose={onUpdateModalClose}
        text={newText}
        onSubmit={handleUpdate}
        isSubmiting={isSubmiting}
      ></UpdateCommentModal>
    </CommentActionsMenuContext.Provider>
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
          <Text fontSize={"sm"} fontWeight={"bold"} cursor={"pointer"} onClick={goToPosterPage}>
            {postedBy.username}
          </Text>
          <Text fontSize={"xs"} width={"auto"} textAlign={"left"} color={"gray.light"}>
            {formatDistanceToNow(new Date(post.createdAt))} {t("ago")}
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
            <Text fontSize={"sm"} fontWeight={"bold"} cursor={"pointer"} onClick={goToPosterPage}>
              {reply?.username}
            </Text>
            <Text fontSize={"xs"} width={"auto"} textAlign={"left"} color={"gray.light"}>
              {formatDistanceToNow(new Date(reply.createdAt))} {t("ago")}
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
  isHidingReplies: PropTypes.bool,
};

PostAsCommentWithVerticalDivider.propTypes = {
  post: PropTypes.object.isRequired,
};

CommentWithVerticalDivider.propTypes = {
  reply: PropTypes.object.isRequired,
  lastReply: PropTypes.bool.isRequired,
};

export default Comment;
