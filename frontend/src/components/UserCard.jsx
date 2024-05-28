import { Avatar, Box, Flex, Text } from "@chakra-ui/react";
import FollowButton from "./FollowButton";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import { useNavigate } from "react-router-dom";

const UserCard = ({ id, username, name, profileImgUrl, isFollowing }) => {
  const isUser = id === useRecoilValue(userAtom)._id;
  const isDarkMode = localStorage.getItem("chakra-ui-color-mode") === "dark";
  const navigate = useNavigate();

  function handleNavigate() {
    navigate(`/${username}`);
  }

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
        <Flex
          align="center"
          columnGap="16px"
          cursor="pointer"
          onClick={handleNavigate}
        >
          <Avatar size={"md"} name={name} src={profileImgUrl} />
          <Box display="inline-block">
            <Text _hover={{ textDecoration: "underline" }}>{username}</Text>
            <Text opacity={isDarkMode ? "0.4": "0.7"} fontWeight="300">{name}</Text>
          </Box>
        </Flex>
        {!isUser && (
          <FollowButton
            position="absolute"
            zIndex="999"
            isFollowing={isFollowing}
            targetUserId={id}
          />
        )}
      </Flex>
    </Flex>
  );
};

export default UserCard;
