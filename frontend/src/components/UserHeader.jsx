import { Avatar } from "@chakra-ui/avatar";
import { Box, VStack, Flex, Text } from "@chakra-ui/layout";
import { Button, useColorModeValue } from "@chakra-ui/react";
import { BsInstagram } from "react-icons/bs";
import useShowToast from "../hooks/useShowToast";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import UpdateProfileModal from "./UpdateProfileModal";
import { PAGE_TYPES } from "../constants/userPage.constants";
import { LuLink2 } from "react-icons/lu";

/**
 * The head of the user page.
 *
 * @param {Object} user The object containing user's infomation.
 * @param {String} showedPage The page that is currently being showed under this component.
 * @param {Function} setShowedPage The function to set the showed page in the `UserPage` component, as defined in {@link PAGE_TYPES}.
 *
 * @returns The JSX code of this component.
 */
const UserHeader = ({ user, showedPage, setShowedPage }) => {
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

  const borderTypes = {
    active: `1px solid ` + useColorModeValue("black", "white"),
    inactive: "0.5px solid gray",
  };

  const buttonTextColors = {
    active: useColorModeValue("black", "white"),
    inactive: "gray",
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
            <LuLink2 style={{ transform: "rotate(-45deg)" }} size={22} cursor={"pointer"} />
          </Box>
        </Flex>
      </Flex>
      <Flex w={"full"} justifyContent={"center"} pb={3} cursor={"pointer"}>
        <UpdateProfileModal />
      </Flex>
      <Flex w={"full"}>
        <Flex
          flex={1}
          borderBottom={showedPage === PAGE_TYPES.threads ? borderTypes.active : borderTypes.inactive}
          transition={"border 0.3s"}
          justifyContent={"center"}
          pb={3}
          cursor={"pointer"}
          onClick={() => setShowedPage(PAGE_TYPES.threads)}
        >
          <Text
            fontWeight={"600"}
            color={showedPage === PAGE_TYPES.threads ? buttonTextColors.active : buttonTextColors.inactive}
            transition={"color 0.3s"}
          >
            {t("threads")}
          </Text>
        </Flex>
        <Flex
          flex={1}
          borderBottom={showedPage === PAGE_TYPES.replies ? borderTypes.active : borderTypes.inactive}
          transition={"border 0.3s"}
          justifyContent={"center"}
          color={"gray.light"}
          pb={3}
          cursor={"pointer"}
          onClick={() => setShowedPage(PAGE_TYPES.replies)}
        >
          <Text
            fontWeight={"600"}
            color={showedPage === PAGE_TYPES.replies ? buttonTextColors.active : buttonTextColors.inactive}
            transition={"color 0.3s"}
          >
            {t("replies")}
          </Text>
        </Flex>
      </Flex>
    </VStack>
  );
};

export default UserHeader;
