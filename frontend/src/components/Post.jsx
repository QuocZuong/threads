import { Link, useNavigate } from "react-router-dom";
import { Flex, Box, Text, HStack, Divider, useDisclosure } from "@chakra-ui/react";
import { Image } from "@chakra-ui/image";
import { Avatar } from "@chakra-ui/avatar";
import useShowToast from "../hooks/useShowToast";
import Actions from "./Actions";
import { formatDistanceToNow } from "date-fns";
import { useRecoilState } from "recoil";
import postsAtom from "../atoms/postsAtom";

import Comment from "./Comment";
import MenuActions from "./MenuActions";
import DeleteModal from "./DeleteModal";
import { useState } from "react";
import { DELETE_MODAL_TYPES } from "../constants/deleteModal.constants";

const Post = ({ post }) => {
  const user = post.postedBy;
  const showToast = useShowToast();
  const navigate = useNavigate();
  const [posts, setPosts] = useRecoilState(postsAtom);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleNavigate = (e) => {
    e.preventDefault();
    navigate(`/${user.username}`);
  };

  const handleDeletePost = async (e) => {
    try {
      e.preventDefault();
      setIsDeleting(true);
      const res = await fetch("/api/posts/" + post._id, {
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
      setPosts(posts.filter((p) => p._id !== post._id));
      showToast("Success", "Post deleted", "success");
    } catch (error) {
      showToast("Error", error, "error");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCopyLink = (e) => {
    const link = `${window.location.origin}/${user.username}/post/${post._id}`;
    navigator.clipboard.writeText(link).then(
      () => {
        showToast("Success", "Link copied!", "success");
      },
      (err) => {
        showToast("Error", err, "error");
      },
    );
  };

  if (!user || !post) return null;

  const firstReply = post.replies.length > 0 ? post.replies[0] : undefined;

  return (
    <>
      {!post[0] ? <Divider /> : undefined}
      <Flex gap={3} py={3}>
        <Flex flexDirection={"column"} alignItems={"center"}>
          <Avatar size={"md"} name={user?.name} src={user?.profilePic} cursor={"pointer"} onClick={handleNavigate} />
          {post.replies.length > 0 ? <Box w={0.5} h={"full"} bg={"gray.light"} mt={3}></Box> : undefined}
        </Flex>

        <Flex flex={1} flexDirection={"column"} gap={2}>
          <Flex justifyContent={"space-between"} w={"full"} h={"20px"}>
            <HStack spacing={1}>
              <Text
                fontSize={"sm"}
                fontWeight={"bold"}
                cursor={"pointer"}
                onClick={handleNavigate}
                _hover={{ textDecoration: "underline" }}
              >
                {user?.username}
              </Text>
              <Image src="/verified.png" w={4} height={4}></Image>
              <Text fontSize={"xs"} width={"auto"} textAlign={"left"} color={"gray.light"}>
                {formatDistanceToNow(new Date(post.createdAt))} ago
              </Text>
            </HStack>
            <MenuActions poster={user} onCopyLink={handleCopyLink} onDelete={onOpen} />
            <DeleteModal
              isOpen={isOpen}
              onClose={onClose}
              onDelete={handleDeletePost}
              isLoading={isDeleting}
              type={DELETE_MODAL_TYPES.post}
            />
          </Flex>
          <Link to={`/${user.username}/post/${post._id}`}>
            <Flex direction={"column"} w={"full"}>
              <Text whiteSpace={"normal"} wordBreak={"break-word"} fontSize={"sm"}>
                {post?.text}
              </Text>
            </Flex>
            {post?.img && (
              <Box mt={3} borderRadius={6} overflow={"hidden"} border={"1px solid"} borderColor={"gray.light"}>
                <Image src={post?.img} w={"full"} />
              </Box>
            )}
            <Flex mt={3}>
              <Actions post={post} />
            </Flex>
          </Link>
        </Flex>
      </Flex>
      {firstReply && (
        <Flex pb={5}>
          <Comment key={firstReply._id} reply={firstReply} lastReply={true} />
        </Flex>
      )}
    </>
  );
};

export default Post;
