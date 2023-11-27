import { Link, useNavigate } from "react-router-dom";
import { Flex, Box, Text } from "@chakra-ui/react";
import { Image } from "@chakra-ui/image";
import { Avatar } from "@chakra-ui/avatar";
import useShowToast from "../hooks/useShowToast";
import { useEffect, useState } from "react";
import Actions from "./Actions";
import { formatDistanceToNow } from "date-fns";
const Post = ({ post, postedBy }) => {
    const [liked, setLiked] = useState(false);
    const [user, setUser] = useState(null);
    const showToast = useShowToast();
    const navigate = useNavigate();

    const handleNavigate = (e) => {
        console.log("hi");
        e.preventDefault();
        navigate(`/${user.username}`);
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
                        {post.replies.length === 0 && <Text textAlign={"center"}>😴</Text>}

                        {post.replies[0] && (
                            <Avatar
                                size={"xs"}
                                name="Segun Adebayo"
                                src={post?.replies[0]?.userProfilePic}
                                position={"absolute"}
                                top={"0px"}
                                left={"15px"}
                                padding={"2px"}
                            />
                        )}
                        {post.replies[1] && (
                            <Avatar
                                size={"xs"}
                                name="Segun Adebayo"
                                src={post?.replies[1]?.userProfilePic}
                                position={"absolute"}
                                top={"0px"}
                                left={"15px"}
                                padding={"2px"}
                            />
                        )}
                        {post.replies[2] && (
                            <Avatar
                                size={"xs"}
                                name="Segun Adebayo"
                                src={post?.replies[2]?.userProfilePic}
                                position={"absolute"}
                                top={"0px"}
                                left={"15px"}
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
                        </Flex>
                    </Flex>

                    <Text fontSize={"sm"}>{post?.text}</Text>
                    {post?.img && (
                        <Box borderRadius={6} overflow={"hidden"} border={"1px solid"} borderColor={"gray.light"}>
                            <Image src={post?.img} w={"full"} />
                        </Box>
                    )}
                    <Flex>
                        <Actions liked={liked} setLiked={setLiked} />
                    </Flex>

                    <Flex gap={2} alignItems={"center"}>
                        <Text color={"gray.light"} fontSize="sm">
                            {post?.replies?.length} replies
                        </Text>
                        <Box w={0.5} h={0.5} borderRadius={"full"} bg={"gray.light"}></Box>
                        <Text color={"gray.light"} fontSize="sm">
                            {post?.likes?.length + (liked ? 1 : 0)} likes
                        </Text>
                    </Flex>
                </Flex>
            </Flex>
        </Link>
    );
};

export default Post;
