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
    <Flex border={isDarkMode ? "white" : "gray"} direction="column" rowGap="16px">
      <Flex align="center" justify="space-between" columnGap="16px" p="16px" position="relative">
        <Flex align="center" columnGap="16px" cursor="pointer" onClick={handleNavigate}>
          <Avatar size={"md"} name={name} src={profileImgUrl} />
          <Box display="inline-block">
            <Text _hover={{ textDecoration: "underline" }}>{username}</Text>
            <Text opacity={isDarkMode ? "0.4" : "0.7"} fontWeight="300">
              {name}
            </Text>
          </Box>
        </Flex>
        {!isUser && <FollowButton position="absolute" zIndex="999" isFollowing={isFollowing} targetUserId={id} />}
        <Box
          position="absolute"
          bottom="0"
          left="5rem"
          right="-2rem"
          height="1px"
          backgroundColor={isDarkMode ? "rgb(70, 70, 70)" : "rgb(230, 230, 230)"}
        />
      </Flex>
    </Flex>
  );
};

export default UserCard;
