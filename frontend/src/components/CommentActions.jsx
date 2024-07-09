import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import useShowToast from "../hooks/useShowToast";
import { createContext, useEffect, useMemo, useState } from "react";
import { Flex, HStack, Icon, Text, keyframes, useDisclosure } from "@chakra-ui/react";
import ReplyCommentModal from "./ReplyModal";
import PropTypes from "prop-types";
import usePreviewImg from "../hooks/usePreviewImg";
import "../components/Action.css";
import { useLocation } from "react-router-dom";

/** The context for each comment's action bar. */
export const CommentActionsContext = createContext(null);

/**
 * The action bar for an individual comment component.
 *
 * @param {React.JSX.Element} comment The comment component itself, why do I need this?
 *
 * @returns {React.JSX.Element} The JSX code for the comment's actions component.
 */
const CommentActions = ({ comment }) => {
  /** For tracking response status */
  const [isLiking, setIsLiking] = useState(false);
  /** For tracking response status */
  const [isReplying, setIsReplying] = useState(false);
  const user = useRecoilValue(userAtom);
  const [isLiked, setIsLiked] = useState(comment.likes.includes(user._id));
  const [numLikes, setNumLikes] = useState(comment.likes.length);
  const [numReplies, setNumReplies] = useState(comment.comments.length);

  const showToast = useShowToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [reply, setReply] = useState("");

  const { handleImageChange, imgUrl, setImgUrl } = usePreviewImg();
  const [isAnimatingLike, setIsAnimatingLike] = useState(false);
  const location = useLocation();

  const bounce = keyframes`
    0% { transform: scale(1); }
    50% { transform: scale(0.8); }
    100% { transform: scale(1); }
  `;

  const contextValue = useMemo(
    () => ({
      handleImageChange,
      imgUrl,
      setImgUrl,
      setReply,
    }),
    [handleImageChange, imgUrl, setImgUrl, setReply],
  );

  useEffect(() => {
    setIsLiked(comment.likes.includes(user._id));
    setNumLikes(comment.likes.length);
    setNumReplies(comment.comments.length);
  }, [location, comment, user]);

  async function handleLike() {
    if (!user) return showToast("Error", "You must be logged in to like a comment", "error");
    if (isLiking) return;

    setIsLiking(true);

    try {
      const res = await fetch("/api/comments/like/" + comment._id, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();

      if (data.error) {
        showToast("Error", data.error, "error");
        return;
      }

      setIsLiked(!isLiked);

      setIsAnimatingLike(true);
      setTimeout(() => {
        setIsAnimatingLike(false);
      }, 500);

      setNumLikes(numLikes + (isLiked ? -1 : 1));
    } catch (error) {
      showToast("Error", error, "error");
    } finally {
      setIsLiking(false);
    }
  }

  async function hanldeReply() {
    if (!user) return showToast("Error", "You must be logged in to reply to a comment", "error");
    if (isReplying) return;

    setIsReplying(true);

    try {
      const res = await fetch("/api/comments/reply/" + comment._id, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: reply, img: imgUrl }),
      });

      const data = await res.json();

      if (data.error) {
        showToast("Error", data.error, "error");
        return;
      }

      showToast("Success", "Reply successfully", "success");
      onClose();
      setReply("");
      setImgUrl("");
      setNumReplies(numReplies + 1);
    } catch (error) {
      showToast("Error", error, "error");
    } finally {
      setIsReplying(false);
    }
  }

  return (
    <CommentActionsContext.Provider value={contextValue}>
      <Flex gap={2}>
        <HStack spacing={2} className="action-icon" onClick={handleLike}>
          <Icon
            w={"20px"}
            h={"20px"}
            aria-label="Like"
            color={isLiked ? "rgb(237, 73, 86)" : ""}
            fill={isLiked ? "rgb(237, 73, 86)" : "transparent"}
            viewBox="0 0 24 22"
            animation={isAnimatingLike ? `${bounce} 0.4s ease` : undefined}
          >
            <path
              d="M1 7.66c0 4.575 3.899 9.086 9.987 12.934.338.203.74.406 1.013.406.283 0 .686-.203 1.013-.406C19.1 16.746 23 12.234 23 7.66 23 3.736 20.245 1 16.672 1 14.603 1 12.98 1.94 12 3.352 11.042 1.952 9.408 1 7.328 1 3.766 1 1 3.736 1 7.66Z"
              stroke="currentColor"
              strokeWidth="2"
            ></path>
          </Icon>
          {numLikes > 0 && <Text fontSize="sm">{numLikes}</Text>}
        </HStack>
        <HStack spacing={2} className="action-icon" onClick={onOpen}>
          <Icon w={"20px"} h={"20px"} aria-label="Comment">
            <title>Comment</title>
            <path
              d="M20.656 17.008a9.993 9.993 0 1 0-3.59 3.615L22 22Z"
              fill="none"
              stroke="currentColor"
              strokeLinejoin="round"
              strokeWidth="2"
            ></path>
          </Icon>
          {numReplies > 0 && <Text fontSize="sm">{numReplies}</Text>}
        </HStack>
      </Flex>

      <ReplyCommentModal
        isOpen={isOpen}
        onClose={onClose}
        text={reply}
        setText={setReply}
        onSubmit={hanldeReply}
        repliedComment={comment}
        isReplying={isReplying}
      />
    </CommentActionsContext.Provider>
  );
};

CommentActions.propTypes = {
  comment: PropTypes.object.isRequired,
};

export default CommentActions;
