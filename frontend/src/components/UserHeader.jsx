import { Avatar } from "@chakra-ui/avatar";
import { Box, VStack, Flex, Text } from "@chakra-ui/layout";
import { Button } from "@chakra-ui/react";
import { BsInstagram } from "react-icons/bs";
import useShowToast from "../hooks/useShowToast";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import UpdateProfileModal from "./UpdateProfileModal";

const UserHeader = ({ user }) => {
  const showToast = useShowToast();
  const currentUser = useRecoilValue(userAtom);
  const [following, setFollowing] = useState(user?.followers.includes(currentUser?._id));
  const [updating, setUpdating] = useState(false);
  const isDarkMode = localStorage.getItem("chakra-ui-color-mode") === "dark";
  const { t } = useTranslation();

  const handleFollowUnfollow = async () => {
    if (!currentUser) {
      showToast("Error", "Please login to follow", "error");
      return;
    }
    setUpdating(true);
    try {
      const res = await fetch(`/api/users/follow/${user._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();

      if (data.error) {
        showToast("An error occurred.", data.error, "error");
        return;
      }

      if (following) {
        showToast("Success", `${t("unfollow")}ed ${user?.name}`, "success");
        user.followers.pop();
      } else {
        showToast("Success", `${t("followed")} ${user?.name}`, "success");
        user.followers.push(currentUser?._id);
      }

      setFollowing((prev) => !prev);
    } catch (error) {
      showToast("Error", error, "error");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <VStack gap={4} alignItems={"start"}>
      <Flex justifyContent={"space-between"} w={"full"}>
        <Box>
          <Text fontSize={"2xl"} fontWeight={"bold"}>
            {user?.name}
          </Text>
          <Flex gap={2} alignItems={"center"}>
            <Text fontSize={"sm"}>{user?.username}</Text>
          </Flex>
        </Box>
        <Box>
          <Avatar
            size={{
              base: "md",
              md: "xl",
            }}
            name={user?.name}
            src={user?.profilePic}
          />
        </Box>
      </Flex>

      <Text>{user?.bio}</Text>

      {currentUser?._id !== user._id && (
        <Button onClick={handleFollowUnfollow} isLoading={updating}>
          {following ? t("unfollow") : t("followed")}
        </Button>
      )}

      <Flex w={"full"} justifyContent={"space-between"}>
        <Flex gap={2} alignItems={"center"}>
          <Text color={"gray.light"}>
            {user?.followers.length} {t("followers")}
          </Text>
        </Flex>
        <Flex gap={2} alignItems={"center"}>
          <Box className={isDarkMode ? "icon-container" : "icon-container_light"}>
            <BsInstagram size={36} cursor={"pointer"} />
          </Box>
        </Flex>
      </Flex>
      <Flex w={"full"} justifyContent={"center"} pb={3} cursor={"pointer"}>
        <UpdateProfileModal />
      </Flex>
      <Flex w={"full"}>
        <Flex flex={1} borderBottom={"1px solid white"} justifyContent={"center"} pb={3} cursor={"pointer"}>
          <Text fontWeight={"bold"}>{t("threads")}</Text>
        </Flex>
        <Flex
          flex={1}
          borderBottom={"1px solid gray"}
          justifyContent={"center"}
          color={"gray.light"}
          pb={3}
          cursor={"pointer"}
        >
          <Text fontWeight={"bold"}>{t("replies")}</Text>
        </Flex>
      </Flex>
    </VStack>
  );
};

export default UserHeader;
