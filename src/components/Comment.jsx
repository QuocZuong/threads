import { useState } from "react";
import { Flex, Text, Divider } from "@chakra-ui/react";
import { Avatar } from "@chakra-ui/avatar";
import { BsThreeDots } from "react-icons/bs";
import Actions from "./Actions";
const Comment = ({ comment, createdAt, likes, username, userAvatar }) => {
    const [liked, setLiked] = useState(false);

    return (
        <>
            <Flex gap={4} py={2} my={2} w={"full"}>
                <Avatar src={userAvatar}></Avatar>
                <Flex gap={1} w={"full"} flexDirection={"column"}>
                    <Flex w={"full"} justifyContent={"space-between"} alignItems={"center"}>
                        <Text fontSize={"sm"} fontWeight={"bold"}>
                            {username}
                        </Text>
                        <Flex gap={2} alignItems={"center"}>
                            <Text fontSize={"sm"} color={"gray.light"}>
                                {createdAt}
                            </Text>
                            <BsThreeDots />
                        </Flex>
                    </Flex>
                    <Text>{comment}</Text>
                    <Actions liked={liked} setLiked={setLiked} />
                    <Text fontSize={"sm"} color={"gray.light"}>
                        {likes + (liked ? 1 : 0)} likes
                    </Text>
                </Flex>
            </Flex>
            <Divider my={4} />
        </>
    );
};

export default Comment;
