import { useContext } from "react";
import { CommentActionsContext } from "../components/CommentActions";

/**
 * Provides the comment actions context's values.
 *
 * @returns {object} An `Object` containing the values.
 */
export const useCommentActions = () => {
  return useContext(CommentActionsContext);
};

export default useCommentActions;
