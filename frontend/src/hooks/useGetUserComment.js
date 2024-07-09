import { useEffect, useState } from "react";
import useShowToast from "./useShowToast";
import useGetUser from "./useGetUser";
import { useParams } from "react-router-dom";

/**
 * Get a user's comments by their username on the URL.
 *
 * @returns {Object} An object containing the loading state and the comments.
 */
export const useGetUserComments = () => {
  const { username } = useParams();
  const { isLoadingUser, user } = useGetUser(username);
  const [isLoadingComments, setIsLoading] = useState(true);
  const [comments, setComments] = useState(null);
  const showToast = useShowToast();

  useEffect(() => {
    if (isLoadingUser) return;

    if (!user) {
      showToast("Error", "User not found", "error");
      return setIsLoading(false);
    }

    const getComments = async () => {
      setIsLoading(true);

      try {
        const res = await fetch(`/api/comments/user/${user._id}`);
        const data = await res.json();

        if (data.error) {
          showToast("Error", data.error, "error");
        }

        setComments(data);
      } catch (error) {
        showToast("Error", error.message, "error");
      } finally {
        setIsLoading(false);
      }
    };

    getComments();
  }, [isLoadingUser, user, showToast]);

  return { isLoadingComments, comments };
};

export default useGetUserComments;
