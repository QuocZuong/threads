import { Flex, Text, Image, Box, Divider, Spinner, useDisclosure } from "@chakra-ui/react";
import { Avatar } from "@chakra-ui/avatar";
import { useNavigate } from "react-router-dom";
import { CommentActionsMenuContext, CommentWithActions } from "../components/Comment";
import useGetUserProfile from "../hooks/useGetUserProfile";
import { formatDistanceToNow } from "date-fns";
import useGetComment from "../hooks/useGetComment";
import CommentActions from "../components/CommentActions";
import { useEffect, useMemo, useState } from "react";
import usePreviewImg from "../hooks/usePreviewImg";
import useShowToast from "../hooks/useShowToast";
import MenuActions from "../components/MenuActions";
import { UpdateCommentModal } from "../components/UpdateModal";
import getUser from "../api/user.api";
import DeleteModal from "../components/DeleteModal";
import { DELETE_MODAL_TYPES } from "../constants/deleteModal.constants";

const CommentPage = () => {
  const { user, isLoading: isLoadingUser } = useGetUserProfile();
  const [postOwner, setPostOwner] = useState(null);
  const { comment: currentComment, isLoading: isLoadingComment } = useGetComment();
  const navigate = useNavigate();
  const [newText, setNewText] = useState("");
  const { handleImageChange, imgUrl, setImgUrl } = usePreviewImg();
  const { isOpen: isUpdateModalOpen, onOpen: onUpdateModalOpen, onClose: onUpdateModalClose } = useDisclosure();
  const [isSubmiting, setIsSubmiting] = useState(false);
  const { isOpen: isDeleteModalOpen, onOpen: onDeleteModalOpen, onClose: onDeleteModalClose } = useDisclosure();
  const [isDeleting, setIsDeleting] = useState(false);

  const showToast = useShowToast();

  const handleNavigate = (e) => {
    e.preventDefault();
    navigate(`/${user.username}`);
  };

  useEffect(() => {
    const setupData = async () => {
      if (!isLoadingComment && currentComment) {
        setNewText(currentComment.text);
        setImgUrl(currentComment.img === "" ? null : currentComment.img);
        setPostOwner(await getUser(currentComment.repliedPost.postedBy));
      }
    };

    setupData();
  }, [currentComment, isLoadingComment, setImgUrl, setNewText, setPostOwner]);

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

  const handleCopyLink = async (e) => {
    e.preventDefault();

    const link = `${window.location.origin}/${currentComment.postedBy.username}/comment/${currentComment._id}`;

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
      const res = await fetch("/api/comments/" + currentComment._id, {
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
      navigate(`/${postOwner.username}/post/${currentComment.repliedPost._id}`);
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
      const res = await fetch("/api/comments/" + currentComment._id, {
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
      <CommentActionsMenuContext.Provider value={contextValue}>
        <Flex>
          <Flex w={"full"} justifyContent={"space-between"} alignItems={"center"}>
            <Flex gap={3}>
              <Avatar
                src={user?.profilePic}
                size={"md"}
                name={user?.username}
                cursor={"pointer"}
                onClick={handleNavigate}
              />
              <Flex gap={2} alignItems={"center"}>
                <Text
                  fontSize={"sm"}
                  fontWeight={"bold"}
                  cursor={"pointer"}
                  onClick={handleNavigate}
                  _hover={{ textDecor: "underline" }}
                >
                  {user?.username}
                </Text>
                <Image src="/verified.png" w={4} height={4}></Image>
                <Text fontSize={"xs"} width={"auto"} color={"gray.light"}>
                  {formatDistanceToNow(new Date(currentComment?.createdAt))} ago
                </Text>
              </Flex>
            </Flex>
            <MenuActions
              poster={currentComment.postedBy}
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
        <UpdateCommentModal
          isOpen={isUpdateModalOpen}
          onClose={onUpdateModalClose}
          text={newText}
          onSubmit={handleUpdate}
          isSubmiting={isSubmiting}
        ></UpdateCommentModal>
      </CommentActionsMenuContext.Provider>
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
