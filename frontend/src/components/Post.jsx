import { Link, useNavigate } from "react-router-dom";
import { Flex, Box, Text } from "@chakra-ui/react";
import { Image } from "@chakra-ui/image";
import { Avatar } from "@chakra-ui/avatar";
import useShowToast from "../hooks/useShowToast";
import { useEffect, useState } from "react";
import Actions from "./Actions";
import { formatDistanceToNow } from "date-fns";
import { DeleteIcon } from "@chakra-ui/icons";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
const Post = ({ post, postedBy }) => {
    const [user, setUser] = useState(null);
    const showToast = useShowToast();
    const navigate = useNavigate();
    const currentUser = useRecoilValue(userAtom);

    const handleNavigate = (e) => {
        console.log("hi");
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
            showToast("Success", "Post deleted", "success");
        } catch (error) {
            showToast("Error", error, "error");
        }
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

    if (!user) {
        return null;
    }
    return (
        <Link to={`${user.username}/post/${post._id}`}>
            <Flex gap={3} mb={4} py={5}>
                <Flex flexDirection={"column"} alignItems={"center"}>
                    <Avatar size={"md"} name={user?.name} src={user?.profilePic} onClick={handleNavigate} />
                    <Box w={0.5} h={"full"} bg={"gray.light"} my={2}></Box>
                    <Box position={"relative"} w={"full"}>
                        {post.replies.length === 0 && <Text textAlign={"center"}>🥱</Text>}
                        {post.replies[0] && (
                            <Avatar
                                size="xs"
                                name={post.replies[0].username}
                                src={post.replies[0].userProfilePic}
                                position={"absolute"}
                                top={"0px"}
                                left="15px"
                                padding={"2px"}
                            />
                        )}

                        {post.replies[1] && (
                            <Avatar
                                size="xs"
                                name={post.replies[1].username}
                                src={post.replies[1].userProfilePic}
                                position={"absolute"}
                                bottom={"0px"}
                                right="-5px"
                                padding={"2px"}
                            />
                        )}

                        {post.replies[2] && (
                            <Avatar
                                size="xs"
                                name={post.replies[2].username}
                                src={post.replies[2].userProfilePic}
                                position={"absolute"}
                                bottom={"0px"}
                                left="4px"
                                padding={"2px"}
                            />
                        )}
                    </Box>
                </Flex>
                <Flex flex={1} flexDirection={"column"} gap={2}>
                    <Flex justifyContent={"space-between"} w={"full"}>
                        <Flex w={"full"} alignItems={"center"}>
                            <Text fontSize={"sm"} fontWeight={"bold"} onClick={handleNavigate}>
                                {user?.username}
                            </Text>
                            <Image src="/verified.png" w={4} height={4} ml={1}></Image>
                        </Flex>
                        <Flex gap={4} alignItems={"center"}>
                            <Text fontSize={"xs"} width={48} textAlign={"right"} color={"gray.light"}>
                                {formatDistanceToNow(new Date(post.createdAt))} ago
                            </Text>

                            {currentUser?._id === user?._id && <DeleteIcon size={20} onClick={handleDeletePost} />}
                        </Flex>
                    </Flex>

                    <Text fontSize={"sm"}>{post?.text}</Text>
                    {post?.img && (
                        <Box borderRadius={6} overflow={"hidden"} border={"1px solid"} borderColor={"gray.light"}>
                            <Image src={post?.img} w={"full"} />
                        </Box>
                    )}
                    <Flex>
                        <Actions post={post} />
                    </Flex>
                </Flex>
            </Flex>
        </Link>
    );
};

export default Post;
