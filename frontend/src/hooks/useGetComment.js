import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useShowToast from "./useShowToast";

/**
 * A custom hook to get a comment by its id, provided in the browser's URL. 
 *
 * @returns {Object} - Returns an object containing the loading state and the comment. 
 */
export const useGetComment = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [comment, setComment] = useState(null);
  const { id } = useParams();
  const showToast = useShowToast();

  useEffect(() => {
    const getComment = async () => {
      setIsLoading(true);

      try {
        const res = await fetch(`/api/comments/${id}`);
        const data = await res.json();

        if (data.error) {
          showToast("Error", data.error, "error");
          return;
        }
        setComment(data);
      } catch (error) {
        showToast("Error", error.message, "error");
      } finally {
        setIsLoading(false);
      }
    };

    getComment();
  }, [id, showToast]);

  return { isLoading, comment };
};

export default useGetComment;
