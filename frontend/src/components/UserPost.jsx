import { Link } from "react-router-dom";
import { Flex, Box, Text } from "@chakra-ui/react";
import { Image } from "@chakra-ui/image";
import { Avatar } from "@chakra-ui/avatar";
import { BsThreeDots } from "react-icons/bs";

import { useState } from "react";
import Actions from "./Actions";
const UserPost = ({ postImg, postTitle, likes, replies }) => {
    const [liked, setLiked] = useState(false);
    return (
        <Link to={"/zuong/post/1"}>
            <Flex gap={3} mb={4} py={5}>
                <Flex flexDirection={"column"} alignItems={"center"}>
                    <Avatar size={"md"} name={"Zuong"} src="/public/zuck-avatar.png" />
                    <Box w={0.5} h={"full"} bg={"gray.light"} my={2}></Box>
                    <Box position={"relative"} w={"full"}>
                        <Avatar
                            size={"xs"}
                            name="Segun Adebayo"
                            src="https://bit.ly/sage-adebayo"
                            position={"absolute"}
                            top={"0px"}
                            left={"15px"}
                            padding={"2px"}
                        />
                        <Avatar
                            size={"xs"}
                            name="Kent Dodds"
                            src="https://bit.ly/kent-c-dodds"
                            position={"absolute"}
                            bottom={"0px"}
                            right={"-5px"}
                            padding={"2px"}
                        />
                        <Avatar
                            size={"xs"}
                            name="Christian Nwamba"
                            src="https://bit.ly/code-beast"
                            position={"absolute"}
                            bottom={"0px"}
                            left={"4px"}
                            padding={"2px"}
                        />
                    </Box>
                </Flex>
                <Flex flex={1} flexDirection={"column"} gap={2}>
                    <Flex justifyContent={"space-between"} w={"full"}>
                        <Flex w={"full"} alignItems={"center"}>
                            <Text fontSize={"sm"} fontWeight={"bold"}>
                                zuong
                            </Text>
                            <Image src="/verified.png" w={4} height={4} ml={1}></Image>
                        </Flex>
                        <Flex gap={4} alignItems={"center"}>
                            <Text fontSize={"sm"} color={"gray.light"}>
                                1d
                            </Text>
                            <BsThreeDots />
                        </Flex>
                    </Flex>

                    <Text fontSize={"sm"}>{postTitle}</Text>
                    {postImg && (
                        <Box borderRadius={6} overflow={"hidden"} border={"1px solid"} borderColor={"gray.light"}>
                            <Image src={postImg} w={"full"} />
                        </Box>
                    )}
                    <Flex>
                        <Actions liked={liked} setLiked={setLiked} />
                    </Flex>

                    <Flex gap={2} alignItems={"center"}>
                        <Text color={"gray.light"} fontSize="sm">
                            {replies} replies
                        </Text>
                        <Box w={0.5} h={0.5} borderRadius={"full"} bg={"gray.light"}></Box>
                        <Text color={"gray.light"} fontSize="sm">
                            {likes + (liked ? 1 : 0)} likes
                        </Text>
                    </Flex>
                </Flex>
            </Flex>
        </Link>
    );
};

export default UserPost;
