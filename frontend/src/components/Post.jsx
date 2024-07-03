import { Link, useNavigate } from "react-router-dom";
import {
  Flex,
  Box,
  Text,
  HStack,
  Divider,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useColorModeValue,
} from "@chakra-ui/react";
import { Image } from "@chakra-ui/image";
import { Avatar } from "@chakra-ui/avatar";
import useShowToast from "../hooks/useShowToast";
import { useEffect, useState } from "react";
import Actions from "./Actions";
import { formatDistanceToNow } from "date-fns";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import postsAtom from "../atoms/postsAtom";
import { HiDotsHorizontal } from "react-icons/hi";
import { AiOutlineDelete } from "react-icons/ai";
import { LuLink2 } from "react-icons/lu";

import Comment from "./Comment";

const Post = ({ post, postedBy }) => {
  const [user, setUser] = useState(null);
  const showToast = useShowToast();
  const navigate = useNavigate();
  const currentUser = useRecoilValue(userAtom);
  const [posts, setPosts] = useRecoilState(postsAtom);

  const handleNavigate = (e) => {
    e.preventDefault();
    navigate(`/${user.username}`);
  };

  const handleDeletePost = async (e) => {
    try {
      e.preventDefault();
      if (!window.confirm("Are you sure to delete this post?")) return;
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

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await fetch(`/api/users/${postedBy}`);
        const data = await res.json();

        if (data.error) {
          showToast("Error", data.error, "error");
          return;
        }
        setUser(data);
      } catch (error) {
        showToast("Error", error, "error");
        setUser(null);
      }
    };

    getUser();
  }, [postedBy, showToast]);

  const menuBg = useColorModeValue("white", "#181818");
  const menuTextColor = useColorModeValue("black", "white");
  const menuItemBgHover = useColorModeValue("gray.100", "#212121");

  if (!user) return null;

  if (!post) return null;

  const firstReply = post.replies.length > 0 ? post.replies[0] : undefined;

  return (
    <>
      {!post[0] ? <Divider /> : undefined}
      <Flex gap={3} py={3}>
        <Flex flexDirection={"column"} alignItems={"center"}>
          <Avatar size={"md"} name={user?.name} src={user?.profilePic} onClick={handleNavigate} />
          {post.replies.length > 0 ? <Box w={0.5} h={"full"} bg={"gray.light"} mt={3}></Box> : undefined}
        </Flex>

        <Flex flex={1} flexDirection={"column"} gap={2}>
          <Flex justifyContent={"space-between"} w={"full"} h={"20px"}>
            <HStack spacing={1}>
              <Text fontSize={"sm"} fontWeight={"bold"} onClick={handleNavigate}>
                {user?.username}
              </Text>
              <Image src="/verified.png" w={4} height={4}></Image>
              <Text fontSize={"xs"} width={"auto"} textAlign={"left"} color={"gray.light"}>
                {formatDistanceToNow(new Date(post.createdAt))} ago
              </Text>
            </HStack>
            <Flex>
              <Menu direction="rlt" placement="bottom-end">
                <MenuButton
                  justifyContent={"flex-end"}
                  p={0}
                  borderRadius="md"
                  // bg={"transparent"}
                  h={"20px"}
                  _hover={"none"}
                >
                  <HiDotsHorizontal />
                </MenuButton>
                <MenuList boxShadow={"unset"} bg={menuBg} color={menuTextColor}>
                  <MenuItem
                    w={"90%"}
                    ml={3}
                    bg={"menuBg"}
                    borderRadius={10}
                    _hover={{ bg: menuItemBgHover }}
                    command={<LuLink2 style={{ transform: "rotate(-45deg)" }} size={22} />}
                    onClick={handleCopyLink}
                  >
                    Copy link
                  </MenuItem>
                  {currentUser?._id === user?._id && (
                    <>
                      <MenuDivider />
                      <MenuItem
                        w={"90%"}
                        ml={3}
                        bg={"menuBg"}
                        borderRadius={10}
                        _hover={{ bg: menuItemBgHover }}
                        onClick={handleDeletePost}
                        cursor={"pointer"}
                        color={"rgb(255, 48, 64)"}
                        command={<AiOutlineDelete color="red.500" size={22} />}
                      >
                        Delete
                      </MenuItem>
                    </>
                  )}
                </MenuList>
              </Menu>
            </Flex>
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
