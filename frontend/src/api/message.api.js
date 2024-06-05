import { useQuery } from "@tanstack/react-query";
import { QUERY_MESSAGES_KEY } from "../constants/query.constants";

export const getMessages = async (otherUserId) => {
  const res = await fetch("/api/messages/" + otherUserId);

  if (!res.ok) {
    throw new Error("Something went wrong");
  }

  const data = await res.json();
  return data;
};

export const useGetMessages = (otherUserId) => {
  return useQuery({
    queryKey: [QUERY_MESSAGES_KEY, otherUserId],
    queryFn: () => getMessages(otherUserId),
  });
};
