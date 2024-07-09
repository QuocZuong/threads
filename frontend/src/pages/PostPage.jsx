import { Flex, Text, Image, Box, Divider, Button, Spinner, useDisclosure } from "@chakra-ui/react";
import { Avatar } from "@chakra-ui/avatar";
import { useParams, useNavigate } from "react-router-dom";
import { DeleteIcon } from "@chakra-ui/icons";
import Actions from "../components/Actions";
import { CommentWithActions } from "../components/Comment";
import useGetUserProfile from "../hooks/useGetUserProfile";
import { useEffect, useState } from "react";
import useShowToast from "../hooks/useShowToast";
import { formatDistanceToNow } from "date-fns";
import { useRecoilValue, useRecoilState } from "recoil";
import userAtom from "../atoms/userAtom";
import postsAtom from "../atoms/postsAtom";
import DeleteModal from "../components/DeleteModal";
const PostPage = () => {
  const { isLoading, user } = useGetUserProfile();
  const [posts, setPosts] = useRecoilState(postsAtom);
  const showToast = useShowToast();
  const { pid } = useParams();
  const currentUser = useRecoilValue(userAtom);
  const navigate = useNavigate();
  const [isDeleteing, setIsDeleting] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();

  let currentPost = posts[0];

  const goToPosterPage = (e) => {
    e.preventDefault();
    navigate(`/${user.username}`);
  };

  useEffect(() => {
    const getPost = async () => {
      try {
        const res = await fetch(`/api/posts/${pid}`);
        const data = await res.json();

        if (data.error) {
          showToast("Error", data.error, "error");
          return;
        }
        setPosts([data]);
        currentPost = posts[0];
      } catch (error) {
        showToast("Error", error, "error");
      }
    };
    document.title = "Post";
    getPost();
  }, [showToast, pid, setPosts]);

  const handleDeletePost = async (e) => {
    try {
      e.preventDefault();
      setIsDeleting(true);
      const res = await fetch("/api/posts/" + currentPost._id, {
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
      setPosts(posts.filter((p) => p._id !== currentPost._id));
      showToast("Success", "Post deleted", "success");
      navigate("/");
    } catch (error) {
      showToast("Error", error, "error");
    } finally {
      setIsDeleting(false);
    }
  };

  if (!user && isLoading) {
    return (
      <Flex justifyContent={"center"}>
        <Spinner size={"xl"} />
      </Flex>
    );
  }

  if (!currentPost) {
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
            onClick={goToPosterPage}
          />
          <Flex>
            <Text
              fontSize={"sm"}
              fontWeight={"bold"}
              cursor={"pointer"}
              onClick={goToPosterPage}
              _hover={{ textDecor: "underline" }}
            >
              {user?.username}
            </Text>
            <Image src="/verified.png" w={4} height={4} ml={3}></Image>
          </Flex>
        </Flex>
        <Flex gap={4} alignItems={"center"}>
          <Text fontSize={"xs"} width={48} textAlign={"right"} color={"gray.light"}>
            {formatDistanceToNow(new Date(currentPost?.createdAt))} ago
          </Text>

          {currentUser?._id === user?._id && <DeleteIcon size={20} onClick={onOpen} cursor={"pointer"} />}
          <DeleteModal isOpen={isOpen} onClose={onClose} onDelete={handleDeletePost} isLoading={isDeleteing} />
        </Flex>
      </Flex>
      <Text my={3}>{currentPost.text}</Text>
      {currentPost.img && (
        <Box borderRadius={6} overflow={"hidden"} border={"1px solid"} borderColor={"gray.light"}>
          <Image src={currentPost?.img} w={"full"} />
        </Box>
      )}
      <Flex gap={3} my={3}>
        <Actions post={currentPost} />
      </Flex>

      <Divider my={4} />
      <Flex justifyContent={"space-between"}>
        <Flex>
          <Flex gap={2} alignItems={"center"}>
            <Text fontSize={"2xl"}>👋</Text>
            <Text color={"gray.light"}>Get the app to like, reply and post.</Text>
          </Flex>
        </Flex>
        <Button>Get</Button>
      </Flex>
      <Divider my={4} />
      {currentPost.replies.map((reply) => (
        <CommentWithActions
          key={reply._id}
          reply={reply}
          lastReply={reply._id === currentPost.replies[currentPost.replies.length - 1]._id}
        />
      ))}
    </>
  );
};

export default PostPage;
