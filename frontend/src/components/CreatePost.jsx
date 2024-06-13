import { useRef, useState } from "react";

import { AddIcon } from "@chakra-ui/icons";
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
  Box,
  Avatar,
  VStack,
  HStack,
  CloseButton,
} from "@chakra-ui/react";
import usePreviewImg from "../hooks/usePreviewImg";
import { useRecoilState, useRecoilValue } from "recoil";
import postsAtom from "../atoms/postsAtom";
import { useParams } from "react-router-dom";
import userAtom from "../atoms/userAtom";
import useShowToast from "../hooks/useShowToast";
import { IoImagesOutline } from "react-icons/io5";
import { BsFiletypeGif } from "react-icons/bs";
import { HiHashtag } from "react-icons/hi2";
import { BiPoll } from "react-icons/bi";

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

  const user = useRecoilValue(userAtom);
  
  const showToast = useShowToast();

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
      <Button
        position={"fixed"}
        bottom={10}
        right={5}
        border={"0.5px solid"}
        borderColor={useColorModeValue("gray", "gray")}
        bg={useColorModeValue("white", "gray.dark")}
        size={{
          base: "sm",
          sm: "md",
        }}
        _hover={{ transform: 'scale(1.2)' }}
        onClick={onOpen}
      >
        <AddIcon />
      </Button>

      <Modal isOpen={isOpen} size={"lg"} onClose={onClose}>
        <ModalOverlay /> 
        <ModalContent  pt={3} bg={useColorModeValue("white", "#181818")} borderRadius={20}>
          {/* <ModalCloseButton /> */}
          <ModalBody pb={6} >
            <Flex>
              <Avatar size="lg" src={user.profilePic} />
              <VStack ml={4} align="start" w={"full"}>
                <Box w={"full"}>
                  <Text fontWeight="bold">{username}</Text>
                  <Input h={"auto"} overflow="visible" variant="unstyled" placeholder="What's new?" onChange={handleTextChange} value={postText} />
                </Box>
                <FormControl>
                  <HStack justify={"space-between"}>
                    <Input type="file" hidden ref={imgRef} onChange={handleImageChange} />
                    <HStack>
                      <IoImagesOutline
                        style={{ cursor: "pointer" }}
                        size={16}
                        onClick={() => imgRef.current.click()}
                        color={useColorModeValue("gray", "gray")}
                      />
                      <BsFiletypeGif
                        style={{ cursor: "pointer" }}
                        size={15}
                        color={useColorModeValue("gray", "gray")}
                      />
                      <HiHashtag style={{ cursor: "pointer" }} size={15} color={useColorModeValue("gray", "gray")} />
                      <BiPoll style={{ cursor: "pointer" }} size={17} color={useColorModeValue("gray", "gray")} />
                    </HStack>

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
                    />
                  </Flex>
                )}
              </VStack>
            </Flex>
          </ModalBody>
          <ModalFooter>
            <Button
              h={7}
              size={"sm"}
              borderRadius={8}
              // colorScheme={useColorModeValue("gray", "gray")}
              color={useColorModeValue("dark", "white")}
              bg={useColorModeValue("white", "dark")}
              border={"0.7px solid"}
              borderColor={useColorModeValue("gray", "gray")}
              onClick={handleCreatePost}
              isLoading={isLoading}
            >
              Post
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default CreatePost;
