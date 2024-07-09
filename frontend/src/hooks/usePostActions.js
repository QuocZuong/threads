import { useContext } from "react";
import { PostActionsContext } from "../components/Actions";

/**
 * Provides the post actions context's values.
 *
 * @returns {object} An `Object` containing the values.
 */
export const usePostActions = () => {
  return useContext(PostActionsContext);
};

export default usePostActions;
