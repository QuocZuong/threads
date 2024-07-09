import { useEffect, useState } from "react";

/**
 * A custom hook to get the user's data by username or id.
 *
 * @param {String} identifier The user's username or id.
 * @returns {Object} An object containing the user's data and the loading state.
 */
export const useGetUser = (identifier) => {
  const [user, setUser] = useState(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await fetch(`/api/users/${identifier}`);
        const data = await res.json();
        setUser(data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoadingUser(false);
      }
    };

    getUser();
  }, [identifier]);

  return { user, isLoadingUser };
};

export default useGetUser;
