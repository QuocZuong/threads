import { Flex, Image, Text } from "@chakra-ui/react";
import FollowButton from "./FollowButton";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";

const UserCard = ({ id, username, name, profileImgUrl, isFollowing }) => {
  const isUser = id === useRecoilValue(userAtom)._id;
  const isDarkMode = localStorage.getItem("chakra-ui-color-mode") === "dark";

  return (
    <Flex
      border={isDarkMode ? "white" : "black"}
      direction="column"
      rowGap="16px"
    >
      <Flex
        align="center"
        justify="space-between"
        columnGap="16px"
        borderBottom="1px solid gray"
        p="16px"
      >
        <Flex align="center" columnGap="16px">
          <Image
            src={profileImgUrl}
            borderRadius="50%"
            w="48px"
            h="48px"
            display="inline-block"
          />
          <Text display="inline-block">{name}</Text>
        </Flex>
        {!isUser && (
          <FollowButton isFollowing={isFollowing} targetUserId={id} />
        )}
      </Flex>
    </Flex>
  );
};

export default UserCard;
