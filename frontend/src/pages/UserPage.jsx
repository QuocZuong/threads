import { useState } from "react";
import UserHeader from "../components/UserHeader";
import { Spinner, Flex } from "@chakra-ui/react";
import useGetUserProfile from "../hooks/useGetUserProfile.js";
import UserThreads from "../components/UserThreads.jsx";
import { PAGE_TYPES } from "../constants/userPage.constants.js";
import UserRepliesThreads from "../components/UserRepliesThreads.jsx";
import { useTranslation } from "react-i18next";
const UserPage = () => {
  const { isLoadingUser, user } = useGetUserProfile();
  const [showedPage, setShowedPage] = useState(PAGE_TYPES.threads);
  const { t } = useTranslation();

  if (isLoadingUser) {
    return (
      <Flex justifyContent={"center"} my={12}>
        <Spinner size={"xl"} />
      </Flex>
    );
  }
  if (!user && !isLoadingUser) return <h1>{t("notFound")}</h1>;

  return (
    <>
      <UserHeader user={user} showedPage={showedPage} setShowedPage={setShowedPage} />
      {showedPage === PAGE_TYPES.threads && <UserThreads />}
      {showedPage === PAGE_TYPES.replies && <UserRepliesThreads />}
    </>
  );
};

export default UserPage;
