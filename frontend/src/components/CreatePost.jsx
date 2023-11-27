import { useRef, useState } from "react";

import { AddIcon } from "@chakra-ui/icons";
import {
    Button,
    useColorModeValue,
    useDisclosure,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    FormControl,
    Textarea,
    Text,
    Input,
    Flex,
    Image,
    CloseButton,
} from "@chakra-ui/react";
import usePreviewImg from "../hooks/usePreviewImg";
import { useRecoilState, useRecoilValue } from "recoil";
import postsAtom from "../atoms/postsAtom";

import { BsFillImageFill } from "react-icons/bs";
import userAtom from "../atoms/userAtom";
import useShowToast from "../hooks/useShowToast";

const MAX_CHAR = 500;

const CreatePost = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();

    const [postText, setPostText] = useState("");
    const [typedChar, setTypedChar] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [posts, setPosts] = useRecoilState(postsAtom);

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
            setPosts([data, ...posts]);
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
                bg={useColorModeValue("gray.300", "gray.dark")}
                size={{
                    base: "sm",
                    sm: "md",
                }}
                onClick={onOpen}
            >
                <AddIcon />
            </Button>

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Create Post</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={6}>
                        <FormControl>
                            <Textarea
                                placeholder="Post content goes here..."
                                onChange={handleTextChange}
                                value={postText}
                            />
                            <Text fontSize="xs" fontWeight={"bold"} textAlign={"right"} m={1} color={"gray.800"}>
                                {typedChar}/{MAX_CHAR}
                            </Text>

                            <Input type="file" hidden ref={imgRef} onChange={handleImageChange} />

                            <BsFillImageFill
                                style={{ marginLeft: "5px", cursor: "pointer" }}
                                size={16}
                                onClick={() => imgRef.current.click()}
                            />
                        </FormControl>

                        {imgUrl && (
                            <Flex mt={5} w={"full"} position={"relative"}>
                                <Image src={imgUrl} alt="Selected image" />
                                <CloseButton
                                    onClick={() => setImgUrl("")}
                                    bg={"gray.800"}
                                    position={"absolute"}
                                    top={2}
                                    right={2}
                                />
                            </Flex>
                        )}
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme="blue" mr={3} onClick={handleCreatePost} isLoading={isLoading}>
                            Post
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};

export default CreatePost;
