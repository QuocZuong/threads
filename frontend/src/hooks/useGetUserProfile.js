import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import useShowToast from "./useShowToast";

const useGetUserProfile = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { username } = useParams();
  const showToast = useShowToast();

  useEffect(() => {
    const getUser = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/users/${username}`);
        const data = await res.json();

        if (data.error) {
          showToast("Error", data.error, "error");
          return;
        }
        setUser(data);
      } catch (error) {
        showToast("Error", error.message, "error");
      } finally {
        setIsLoading(false);
      }
    };

    getUser();
  }, [username, showToast]);

  return { isLoading, user };
};

export default useGetUserProfile;
