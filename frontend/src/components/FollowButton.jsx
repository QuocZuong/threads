import { useState } from "react";
import useShowToast from "../hooks/useShowToast";
import { Button } from "@chakra-ui/react";
import "../components/FollowButton.css";

const FollowButton = ({ isFollowing, targetUserId }) => {
  const [status, setStatus] = useState(isFollowing);
  const [isLoading, setIsLoading] = useState(false);
  const showToast = useShowToast();

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
      showToast("Error", "Please try again later, we are encountering some errors", "error");
    } finally {
      setIsLoading(false);
    }

    setStatus(!status);
  }

  return (
    <Button
      w="100px"
      h="30px"
      className="followButon"
      isLoading={isLoading}
      bgColor="transparent"
      border="1px solid gray"
      rounded="md"
      onClick={follow}
    >
      {status ? "Following" : "Follow"}
    </Button>
  );
};

export default FollowButton;
