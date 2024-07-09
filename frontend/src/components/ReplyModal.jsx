import {
  Avatar,
  Box,
  Button,
  CloseButton,
  Flex,
  FormControl,
  HStack,
  Image,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  Textarea,
  VStack,
  useColorModeValue,
} from "@chakra-ui/react";
import PropTypes from "prop-types";
import { CommentWithVerticalDivider, PostAsCommentWithVerticalDivider } from "./Comment";
import { useEffect, useRef, useState } from "react";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import { IoImagesOutline } from "react-icons/io5";
import { useTranslation } from "react-i18next";
import useCommentActions from "../hooks/useCommentActions";
import usePostActions from "../hooks/usePostActions";
import { useNavigate } from "react-router-dom";

/**
 * The modal for replying to a comment.
 *
 * @param {boolean} isOpen Whether the modal is open.
 * @param {function} onClose The function to close the modal.
 * @param {string} text The text in the modal.
 * @param {function} onSubmit The function to submit the reply to the comment.
 * @param {object} repliedComment The comment that is being replied to.
 * @param {boolean} isReplying Whether the reply is being submitted.
 *
 * @returns {React.JSX.Element} The JSX code for this component.
 */
export const ReplyCommentModal = ({ isOpen, onClose, text, onSubmit, repliedComment, isReplying }) => {
  const { t } = useTranslation();
  const [isTextEmpty, setIsTextEmpty] = useState(text.length === 0);

  useEffect(() => {
    setIsTextEmpty(text.length === 0);
  }, [text]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} position={"relative"}>
      <ModalOverlay />
      <ModalContent bg={"transparent"} maxWidth={"600px"} position={"absolute"} top={"15%"} boxShadow={"none"}>
        <ModalHeader>
          <Flex justifyContent={"center"}>
            <Text fontWeight={600}>{t("modalHeader")}</Text>
          </Flex>
        </ModalHeader>
        <Box bg={useColorModeValue("white", "#181818")} borderRadius={20} pt={5}>
          <ModalBody>
            <CommentWithVerticalDivider reply={repliedComment} lastReply={true} />
            <ReplyCommentModalInput />
          </ModalBody>
          <ModalFooter>
            <Button
              size={"sm"}
              w={"15%"}
              border={"0.1px solid"}
              borderRadius={"10px"}
              bg={useColorModeValue("white", "dark")}
              color={useColorModeValue("dark", "white")}
              borderColor={useColorModeValue("#d9d9d9", "#383939")}
              _hover={{ bg: "none" }}
              isDisabled={isTextEmpty}
              onClick={onSubmit}
              isLoading={isReplying}
            >
              {t("postButton")}
            </Button>
          </ModalFooter>
        </Box>
      </ModalContent>
    </Modal>
  );
};

ReplyCommentModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  text: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired,
  repliedComment: PropTypes.object.isRequired,
  isReplying: PropTypes.bool.isRequired,
};

/**
 * A customized input component for the reply modal.
 *
 * @returns The JSX code for this component.
 */
const ReplyCommentModalInput = () => {
  const user = useRecoilValue(userAtom);
  const textareaRef = useRef(null);
  const imgRef = useRef(null);

  const MAX_CHAR = 500;
  const [postText, setPostText] = useState("");
  const [typedChar, setTypedChar] = useState(0);
  const { t } = useTranslation();

  let { setReply, handleImageChange, imgUrl, setImgUrl } = useCommentActions();
  const navigate = useNavigate();

  const goToUserPage = (e) => {
    e.preventDefault();
    navigate(`/${user.username}`);
  };

  const handleTextChange = (e) => {
    const inputText = e.target.value;

    if (inputText.length > MAX_CHAR) {
      const truncatedText = inputText.slice(0, MAX_CHAR);
      setPostText(truncatedText);
      setReply(truncatedText);
      setTypedChar(500);
    } else {
      setPostText(inputText);
      setReply(inputText);
      setTypedChar(inputText.length);
    }

    if (textareaRef.current) {
      textareaRef.current.style.height = "24px";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  return (
    <Flex>
      <Avatar size="md" src={user.profilePic} cursor={"pointer"} onClick={goToUserPage} />
      <VStack ml={4} align="start" w={"full"} spacing={0}>
        <Text fontWeight={"500"} cursor={"pointer"} onClick={goToUserPage} _hover={{ textDecoration: "underline" }}>
          {user.username}
        </Text>
        <Textarea
          ref={textareaRef}
          variant="unstyled"
          placeholder={t("inputPlaceholder") + ` ${user.username}...`}
          onChange={handleTextChange}
          value={postText}
          overflow="hidden"
          resize={"none"}
          minHeight={"30px"}
          rows={1}
          p={0}
        />
        <FormControl>
          <HStack justify={"space-between"}>
            <Input type="file" hidden ref={imgRef} onChange={handleImageChange} />
            <IoImagesOutline
              style={{ cursor: "pointer" }}
              size={16}
              onClick={() => imgRef.current.click()}
              color={useColorModeValue("gray")}
            />
            <Text
              fontSize="xs"
              fontWeight={"bold"}
              textAlign={"right"}
              m={1}
              color={useColorModeValue("gray.300", "gray")}
            >
              {typedChar}/{MAX_CHAR}
            </Text>
          </HStack>
        </FormControl>

        {imgUrl && (
          <Flex mt={5} w={"300px"} position={"relative"}>
            <Image src={imgUrl} borderRadius={10} alt="Selected image" />
            <CloseButton
              onClick={() => setImgUrl("")}
              bg={"gray"}
              size={"sm"}
              borderRadius={100}
              position={"absolute"}
              top={2}
              right={2}
              opacity={0.3}
              _hover={{ opacity: 0.8 }}
            />
          </Flex>
        )}
      </VStack>
    </Flex>
  );
};

/**
 * The modal for replying to a post.
 *
 * @param {boolean} isOpen Whether the modal is open.
 * @param {function} onClose The function to close the modal.
 * @param {string} text The text in the modal.
 * @param {function} onSubmit The function to submit the reply to the post.
 * @param {object} repliedPost The post that is being replied to.
 * @param {boolean} isReplying Whether the reply is being submitted.
 *
 * @returns {React.JSX.Element} The JSX code for this component.
 */
export const ReplyPostModal = ({ isOpen, onClose, text, onSubmit, repliedPost, isReplying }) => {
  const { t } = useTranslation();
  const [isTextEmpty, setIsTextEmpty] = useState(text.length === 0);

  useEffect(() => {
    setIsTextEmpty(text.length === 0);
  }, [text]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} position={"relative"}>
      <ModalOverlay />
      <ModalContent
        bg={"transparent"}
        maxWidth={"600px"}
        position={"absolute"}
        top={repliedPost.img ? "-8%" : "15%"}
        boxShadow={"none"}
      >
        <ModalHeader>
          <Flex justifyContent={"center"}>
            <Text fontWeight={600}>{t("modalHeader")}</Text>
          </Flex>
        </ModalHeader>
        <Box bg={useColorModeValue("white", "#181818")} borderRadius={20} pt={5}>
          <ModalBody>
            <PostAsCommentWithVerticalDivider post={repliedPost} postedBy={repliedPost.postedBy} />
            <ReplyPostModalInput />
          </ModalBody>
          <ModalFooter>
            <Button
              size={"sm"}
              w={"15%"}
              border={"0.1px solid"}
              borderRadius={"10px"}
              bg={useColorModeValue("white", "dark")}
              color={useColorModeValue("dark", "white")}
              borderColor={useColorModeValue("#d9d9d9", "#383939")}
              _hover={{ bg: "none" }}
              isDisabled={isTextEmpty}
              onClick={onSubmit}
              isLoading={isReplying}
            >
              {t("postButton")}
            </Button>
          </ModalFooter>
        </Box>
      </ModalContent>
    </Modal>
  );
};

ReplyPostModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  text: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired,
  repliedPost: PropTypes.object.isRequired,
  isReplying: PropTypes.bool.isRequired,
};

/**
 * A customized input component for the reply modal.
 *
 * @returns The JSX code for this component.
 */
const ReplyPostModalInput = () => {
  const user = useRecoilValue(userAtom);
  const textareaRef = useRef(null);
  const imgRef = useRef(null);

  const MAX_CHAR = 500;
  const [postText, setPostText] = useState("");
  const [typedChar, setTypedChar] = useState(0);
  const { t } = useTranslation();

  let { setReply, handleImageChange, imgUrl, setImgUrl } = usePostActions();

  const navigate = useNavigate();

  const goToUserPage = (e) => {
    e.preventDefault();
    navigate(`/${user.username}`);
  };

  const handleTextChange = (e) => {
    const inputText = e.target.value;

    if (inputText.length > MAX_CHAR) {
      const truncatedText = inputText.slice(0, MAX_CHAR);
      setPostText(truncatedText);
      setReply(truncatedText);
      setTypedChar(500);
    } else {
      setPostText(inputText);
      setReply(inputText);
      setTypedChar(inputText.length);
    }

    if (textareaRef.current) {
      textareaRef.current.style.height = "24px";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  return (
    <Flex>
      <Avatar size="md" src={user.profilePic} cursor={"pointer"} onClick={goToUserPage} />
      <VStack ml={4} align="start" w={"full"} spacing={0}>
        <Text fontWeight={"500"} cursor={"pointer"} onClick={goToUserPage} _hover={{ textDecoration: "underline" }}>
          {user.username}
        </Text>
        <Textarea
          ref={textareaRef}
          variant="unstyled"
          placeholder={t("inputPlaceholder") + ` ${user.username}...`}
          onChange={handleTextChange}
          value={postText}
          overflow="hidden"
          resize={"none"}
          minHeight={"30px"}
          rows={1}
          p={0}
        />
        <FormControl>
          <HStack justify={"space-between"}>
            <Input type="file" hidden ref={imgRef} onChange={handleImageChange} />
            <IoImagesOutline
              style={{ cursor: "pointer" }}
              size={16}
              onClick={() => imgRef.current.click()}
              color={useColorModeValue("gray")}
            />
            <Text
              fontSize="xs"
              fontWeight={"bold"}
              textAlign={"right"}
              m={1}
              color={useColorModeValue("gray.300", "gray")}
            >
              {typedChar}/{MAX_CHAR}
            </Text>
          </HStack>
        </FormControl>

        {imgUrl && (
          <Flex mt={5} w={"300px"} position={"relative"}>
            <Image src={imgUrl} borderRadius={10} alt="Selected image" />
            <CloseButton
              onClick={() => setImgUrl("")}
              bg={"gray"}
              size={"sm"}
              borderRadius={100}
              position={"absolute"}
              top={2}
              right={2}
              opacity={0.3}
              _hover={{ opacity: 0.8 }}
            />
          </Flex>
        )}
      </VStack>
    </Flex>
  );
};

export default ReplyCommentModal;
