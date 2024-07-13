import { useRef, useState, useEffect } from "react";
import {
  Button,
  useColorModeValue,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalFooter,
  ModalBody,
  FormControl,
  Text,
  Input,
  Flex,
  Image,
  Avatar,
  VStack,
  HStack,
  CloseButton,
  Textarea,
  Box,
} from "@chakra-ui/react";
import usePreviewImg from "../hooks/usePreviewImg";
import { useRecoilState, useRecoilValue } from "recoil";
import postsAtom from "../atoms/postsAtom";
import { useNavigate } from "react-router-dom";
import userAtom from "../atoms/userAtom";
import useShowToast from "../hooks/useShowToast";
import { IoImagesOutline } from "react-icons/io5";
import { useTranslation } from "react-i18next";
import axios from "axios";

const MAX_CHAR = 500;

const ModalEditPost = ({ poster, isOpen, onClose, onUpdatePost, post }) => {
  const [isLoading, setIsLoading] = useState(false);
  const user = useRecoilValue(userAtom);
  const [postText, setPostText] = useState(post ? post.text : "");
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [typedChar, setTypedChar] = useState(0);
  const textareaRef = useRef(null);
  const imgRef = useRef(null);
  const { handleImageChange, imgUrl, setImgUrl } = usePreviewImg(post ? post.img : "");

  console.log("img", imgUrl);
  useEffect(() => {
    if (isOpen) {
      setPostText(post.text);
      setImgUrl(post.img); // Cập nhật trực tiếp URL hình ảnh
    }
  }, [isOpen, post, setImgUrl]);

  const handleEditPost = async () => {
    try {
      const res = await axios.patch(`/api/posts/edit/${post._id}`, {
        postedBy: poster?._id,
        text: postText,
        img: imgUrl,
      });

      if (res.status === 200) {
        onUpdatePost(res.data); // Update post in parent component
        onClose(); // Close modal after successful edit

        // Refresh the page after successful edit
        window.location.reload();
      } else {
        throw new Error("Failed to edit post.");
      }
    } catch (error) {
      console.error("Error editing post:", error);
      // Handle error messages here if needed
    }
  };
  const goToProfilePage = (e) => {
    e.preventDefault();
    navigate(`/${user.username}`);
  };
  const handleTextChange = (e) => {
    const inputText = e.target.value;
    if (inputText.length > MAX_CHAR) {
      const truncatedText = inputText.slice(0, MAX_CHAR);
      setPostText(truncatedText);
      setTypedChar(500);
    } else {
      setPostText(inputText);
      setTypedChar(inputText.length);
    }

    if (textareaRef.current) {
      textareaRef.current.style.height = "24px";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };
  console.log("post tex ", post);

  return (
    <>
      <Modal isOpen={isOpen} size={"lg"} onClose={onClose}>
        <ModalOverlay />
        <ModalContent pt={3} bg={useColorModeValue("white", "#181818")} borderRadius={20}>
          <ModalBody pb={0}>
            <Flex>
              <Avatar size="md" src={user.profilePic} cursor={"pointer"} onClick={goToProfilePage} />
              <VStack ml={4} align="start" w={"full"} spacing={0}>
                <Text fontWeight={"500"} cursor={"pointer"} onClick={goToProfilePage}>
                  {user.username}
                </Text>
                <Textarea
                  ref={textareaRef}
                  variant="unstyled"
                  placeholder="What's new?"
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
                      color={useColorModeValue("gray", "gray")}
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
          </ModalBody>
          <ModalFooter>
            <Button
              h={8}
              size={"md"}
              borderRadius={"20px"}
              color={useColorModeValue("dark", "white")}
              bg={useColorModeValue("white", "dark")}
              border={"0.7px solid"}
              borderColor={useColorModeValue("gray", "gray")}
              onClick={handleEditPost}
              _hover={{ bg: "none" }}
              isLoading={isLoading}
            >
              {t("Update")}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
export default ModalEditPost;
