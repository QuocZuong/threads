import { useQuery } from "@tanstack/react-query";
import { QUERY_CONVERSATIONS_KEY } from "../constants/query.constants";

export const getAllConversations = async () => {
  const res = await fetch("/api/conversations");

  if (!res.ok) {
    throw new Error("Something went wrong");
  }

  const data = await res.json();
  return data;
};

export const useGetAllConversations = () => {
  return useQuery({
    queryKey: QUERY_CONVERSATIONS_KEY,
    queryFn: getAllConversations,
  });
};
