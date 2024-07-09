import { useContext } from "react";
import { CommentActionsMenuContext } from "../components/Comment";

/**
 * Provides the comment actions menu context's values.
 *
 * @returns {object} An `Object` containing the values.
 */
export const useCommentActionsMenu = () => {
  return useContext(CommentActionsMenuContext);
};

export default useCommentActionsMenu;
