import { useRef, useState } from "react";
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
import { useNavigate, useParams } from "react-router-dom";
import userAtom from "../atoms/userAtom";
import useShowToast from "../hooks/useShowToast";
import { IoImagesOutline } from "react-icons/io5";
import { useTranslation } from "react-i18next";

const MAX_CHAR = 500;

const CreatePost = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [postText, setPostText] = useState("");
  const [typedChar, setTypedChar] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [posts, setPosts] = useRecoilState(postsAtom);
  const { username } = useParams();
  const imgRef = useRef(null);
  const { handleImageChange, imgUrl, setImgUrl } = usePreviewImg();
  const { t } = useTranslation();

  const textareaRef = useRef(null);

  const user = useRecoilValue(userAtom);

  const showToast = useShowToast();
  const navigate = useNavigate();

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

  const handleCreatePost = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/posts/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ postedBy: user._id, text: postText, img: imgUrl }),
      });

      const data = await res.json();

      if (data.error) {
        showToast("An error occurred.", data.error, "error");
        return;
      }

      showToast("Create post success", "", "success");
      if (username === user.username) {
        setPosts([data, ...posts]);
      }
      onClose();
    } catch (error) {
      showToast("Error", error, "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Flex
        display={"flex"}
        gap={10}
        mt={4}
        w={"full"}
        borderBottom={"0.05px solid gray"}
        pb={3}
        alignItems="center"
        onClick={onOpen}
      >
        <Box cursor={"pointer"} onClick={goToProfilePage}>
          <Avatar size="md" name={user?.name} src={user?.profilePic} />
        </Box>
        <Text onClick={onOpen} bg={"none"} cursor={"text"} width="100%" opacity={0.6} ml="-30px">
          {t("startThreads")}
        </Text>

        <Button
          size={"sm"}
          w={"15%"}
          border={"0.7px solid"}
          borderRadius={"20px"}
          bg={useColorModeValue("white", "dark")}
          color={useColorModeValue("dark", "white")}
          borderColor={useColorModeValue("gray", "gray")}
          _hover={{ bg: "none" }}
        >
          {t("post")}
        </Button>
      </Flex>

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
                  placeholder={t("whatNew")}
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
              onClick={handleCreatePost}
              _hover={{ bg: "none" }}
              isLoading={isLoading}
            >
              {t("post")}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default CreatePost;
