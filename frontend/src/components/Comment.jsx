import { Flex, Text, Divider } from "@chakra-ui/react";
import { Avatar } from "@chakra-ui/avatar";
const Comment = ({ reply, lastReply }) => {
    return (
        <>
            <Flex gap={4} py={2} my={2} w={"full"}>
                <Avatar src={reply?.userProfilePic}></Avatar>
                <Flex gap={1} w={"full"} flexDirection={"column"}>
                    <Flex w={"full"} justifyContent={"space-between"} alignItems={"center"}>
                        <Text fontSize={"sm"} fontWeight={"bold"}>
                            {reply?.username}
                        </Text>
                    </Flex>
                    <Text>{reply?.text}</Text>
                </Flex>
            </Flex>
            {!lastReply ? <Divider my={4} /> : null}
        </>
    );
};

export default Comment;
