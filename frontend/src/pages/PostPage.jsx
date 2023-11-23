import { useState } from "react";
import { Flex, Text, Image, Box, Divider, Button } from "@chakra-ui/react";
import { Avatar } from "@chakra-ui/avatar";
import { BsThreeDots } from "react-icons/bs";
import Actions from "../components/Actions";
import Comment from "../components/Comment";
const PostPage = () => {
    const [liked, setLiked] = useState(false);
    return (
        <>
            <Flex>
                <Flex w={"full"} alignItems={"center"} gap={3}>
                    <Avatar src="/zuck-avatar.png" size={"md"} name="zuong" />
                    <Flex>
                        <Text fontSize={"sm"} fontWeight={"bold"}>
                            zuong
                        </Text>
                        <Image src="/verified.png" w={4} height={4} ml={3}></Image>
                    </Flex>
                </Flex>
                <Flex gap={4} alignItems={"center"}>
                    <Text fontSize={"sm"} color={"gray.light"}>
                        1d
                    </Text>
                    <BsThreeDots />
                </Flex>
            </Flex>
            <Text my={3}>Let&apos;s talk about Threads</Text>
            <Box borderRadius={6} overflow={"hidden"} border={"1px solid"} borderColor={"gray.light"}>
                <Image src={"/post1.png"} w={"full"} />
            </Box>
            <Flex gap={3} my={3}>
                <Actions liked={liked} setLiked={setLiked} />
            </Flex>

            <Flex gap={2} alignItems={"center"}>
                <Text color={"gray.light"} fontSize={"sm"}>
                    230 replies
                </Text>
                <Box w={0.5} h={0.5} borderRadius={"full"} bg={"gray.light"}></Box>
                <Text color={"gray.light"} fontSize={"sm"}>
                    {200 + (liked ? 1 : 0)} likes
                </Text>
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
            <Comment
                comment="Hey this look great!"
                createdAt="2d"
                likes={100}
                username="Zuong"
                userAvatar="/zuck-avatar.png"
            />
            <Comment comment="Siuuuuuu" createdAt="6d" likes={14100} username="Ronaldo" userAvatar="/zuck-avatar.png" />
            <Comment
                comment="Hey this look great!"
                createdAt="2d"
                likes={100}
                username="Zuong"
                userAvatar="/zuck-avatar.png"
            />
        </>
    );
};

export default PostPage;
