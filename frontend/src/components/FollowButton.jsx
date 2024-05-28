import { useEffect, useState } from "react";
import useShowToast from "../hooks/useShowToast";
import { Button } from "@chakra-ui/react";

const FollowButton = ({ isFollowing, targetUserId }) => {
  const [status, setStatus] = useState(isFollowing);
  const [isLoading, setIsLoading] = useState(false);
  const isDarkMode = localStorage.getItem("chakra-ui-color-mode") === "dark";
  const showToast = useShowToast();

  function changeStatus() {
    setStatus(!status);
  }

  useEffect(() => {
    async function follow() {
      try {
        setIsLoading(true);
        const res = await fetch(`/api/users/follow/${targetUserId}`, {
          method: "POST",
        });
        const data = await res.json();

        if (res.status !== 200) throw new Error(JSON.stringify(data));
      } catch (err) {
        console.log(err);
        showToast(
          "Error",
          "Please try again later, we are encountering some errors",
          "error",
        );
      } finally {
        setIsLoading(false);
      }
    }

    follow();
  }, [status]);

  return (
    <>
      <Button w="90px" isLoading={isLoading} bgColor="transparent" border="1px solid gray" rounded="md" onClick={changeStatus}>
        {status ? "Following" : "Follow"}
      </Button>
    </>
  );
};

export default FollowButton;
