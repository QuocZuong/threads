import {
  Flex,
  Text,
  Box,
  Modal,
  Button,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  FormControl,
  Input,
  HStack,
  keyframes,
} from "@chakra-ui/react";
import { useState } from "react";
import { useRecoilValue, useRecoilState } from "recoil";
import userAtom from "../atoms/userAtom";
import postsAtom from "../atoms/postsAtom";
import useShowToast from "../hooks/useShowToast";
import { GoHeartFill, GoHeart } from "react-icons/go";
import { FiRepeat } from "react-icons/fi";
import { PiChatCircle } from "react-icons/pi";
import { FiSend } from "react-icons/fi";
import "../components/Action.css";

const Actions = ({ post }) => {
  const user = useRecoilValue(userAtom);
  const showToast = useShowToast();
  const [liked, setLiked] = useState(post?.likes.includes(user?._id));
  const [reply, setReply] = useState("");
  const [posts, setPosts] = useRecoilState(postsAtom);
  const [isLiking, setIsLiking] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [animateLike, setAnimateLike] = useState(false);

  const bounce = keyframes`
    0% { transform: scale(1); }
    50% { transform: scale(0.8); }
    100% { transform: scale(1); }
  `;

  const handleLikeAndUnlike = async () => {
    if (!user) return showToast("Error", "You must be logged in to like a post", "error");
    if (isLiking) return;
    setIsLiking(true);
    try {
      const res = await fetch("/api/posts/like/" + post._id, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();
      if (data.error) {
        showToast("Error", data.error, "error");
        return;
      }
      if (!liked) {
        const updatedPosts = posts.map((p) => {
          if (p._id === post._id) {
            return { ...p, likes: [...p.likes, user._id] };
          }
          return p;
        });

        setPosts(updatedPosts);
      } else {
        const updatedPosts = posts.map((p) => {
          if (p._id === post._id) {
            return { ...p, likes: p?.likes?.filter((id) => id !== user._id) };
          }
          return p;
        });

        setPosts(updatedPosts);
      }

      setLiked(!liked);
      setAnimateLike(true);
      setTimeout(() => {
        setAnimateLike(false);
      }, 500);
    } catch (error) {
      showToast("Error", error, "error");
    } finally {
      setIsLiking(false);
    }
  };

  const handleReply = async () => {
    if (!user) return showToast("Error", "You must be logged in to reply a post", "error");
    if (isReplying) return;
    setIsReplying(true);
    try {
      const res = await fetch("/api/posts/reply/" + post._id, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: reply }),
      });
      const data = await res.json();
      if (data.error) {
        showToast("Error", data.error, "error");
        return;
      }

      const updatePosts = posts.map((p) => {
        if (p._id === post._id) {
          return { ...p, replies: [...p.replies, data] };
        }
        return p;
      });

      setPosts(updatePosts);

      showToast("Success", "Reply successfully", "success");
      onClose();
      setReply("");
    } catch (error) {
      showToast("Error", error, "error");
    } finally {
      setIsReplying(false);
    }
  };

  return (
    <Flex flexDirection="column">
      <Flex gap={3} my={1} onClick={(e) => e.preventDefault()} className="">
        <Flex gap={2} alignItems={"center"}>
          <HStack spacing={6}>
            <Box w={"auto"} onClick={handleLikeAndUnlike} className="action-icon">
              <HStack title="Like" animation={animateLike ? `${bounce} 0.4s ease` : undefined} spacing={1}>
                {liked ? <GoHeartFill size={"23px"} fill={"#ff0033"} /> : <GoHeart size={"23px"} />}
                {post?.likes?.length > 0 ? (
                  <Text color={liked ? "#ff0033" : "white"} fontSize="sm">
                    {post?.likes?.length}
                  </Text>
                ) : undefined}
              </HStack>
            </Box>

            <Box w={"auto"} onClick={onOpen} className="action-icon">
              <HStack justifyContent={"center"} alignContent={"center"}>
                <PiChatCircle size={"23px"} style={{ transform: "scaleX(-1)" }} />
                {post?.replies?.length >= 1 ? <Text fontSize="sm">{post?.replies?.length}</Text> : ""}
              </HStack>
            </Box>

            <Box className="action-icon">
              <FiRepeat size={"19px"} />
            </Box>

            <Box className="action-icon">
              <FiSend style={{ transform: "rotate(20deg)" }} size={"21px"} />
            </Box>
          </HStack>
        </Flex>
      </Flex>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Reply</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <Input placeholder="Reply goes here..." value={reply} onChange={(e) => setReply(e.target.value)}></Input>
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" size={"sm"} mr={3} onClick={handleReply} isLoading={isReplying}>
              Reply
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  );
};

export default Actions;
