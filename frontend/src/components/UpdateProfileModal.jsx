import { useState, useRef, useEffect } from "react";
import { useRecoilState } from "recoil";
import userAtom from "../atoms/userAtom.js";
import {
  Button,
  Flex,
  Input,
  useColorModeValue,
  Avatar,
  HStack,
  Box,
  Divider,
  Text,
  useDisclosure,
  ModalFooter,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  VStack,
} from "@chakra-ui/react";
import usePreviewImg from "../hooks/usePreviewImg";
import useShowToast from "../hooks/useShowToast.js";
import { CiLock } from "react-icons/ci";
import { useTranslation } from "react-i18next";

const UpdateProfileModal = () => {
  const [user, setUser] = useRecoilState(userAtom);
  const fileRef = useRef(null);
  const { handleImageChange, imgUrl } = usePreviewImg();
  const [updating, setUpdating] = useState(false);
  const showToast = useShowToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {t} = useTranslation();
  const [inputs, setInputs] = useState({
    name: user.name,
    username: user.username,
    email: user.email,
    bio: user.bio,
    password: "",
    profilePic: user.profilePic,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      const res = await fetch(`/api/users/${user._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        // profilePic get from usePreviewImg if user change profilePic
        body: JSON.stringify({ ...inputs, profilePic: imgUrl || inputs.profilePic }),
      });
      const data = await res.json(); // updated user object
      if (data.error) {
        showToast("Error", data.error, "error");
        return;
      }
      showToast("Success", "Profile updated successfully", "success");
      setUser(data);
      localStorage.setItem("user-threads", JSON.stringify(data));
      onClose();
    } catch (error) {
      showToast("Error", error.message, "error");
    } finally {
      setUpdating(false);
    }
  };

  useEffect(() => {
    document.title = "Update profile";
  }, []);

  return (
    <>
      <Button w={"full"} bg={"none"} border={"groove 0.2px grey"} onClick={onOpen}>
        {t('updateProfile')}
      </Button>

      <Modal isOpen={isOpen} size={"lg"} onClose={onClose}>
        <ModalOverlay />
        <ModalContent pt={3} bg={useColorModeValue("white", "#181818")} borderRadius={20}>
          <ModalBody pb={6}>
            <Flex>
              <VStack w={"full"} align="start">
                <HStack direction={["column", "row"]} w={"full"} spacing={4} justify={"space-between"}>
                  <Flex direction="column" w={"85%"}>
                    <Text>{t('name')}</Text>
                    <HStack pb={3} pt={3}>
                      <CiLock color="gray.300" />
                      <Text>{`${inputs.name} (@${inputs.username})`}</Text>
                    </HStack>
                    <Divider />
                  </Flex>
                  <Flex direction="column" align="center">
                    <Box w={50}>
                      <Button w={10} onClick={() => fileRef.current.click()}>
                        <Avatar size="lg" src={imgUrl || inputs.profilePic} />
                      </Button>
                      <Input type={"file"} hidden ref={fileRef} onChange={handleImageChange}></Input>
                    </Box>
                  </Flex>
                </HStack>
                <Flex direction="column" w={"full"}>
                  <Text>{t('bio')}</Text>
                  <Input
                    value={inputs.bio}
                    onChange={(e) => {
                      setInputs({ ...inputs, bio: e.target.value });
                    }}
                    placeholder={t('addBio')}
                    variant={"flushed"}
                    _placeholder={{ color: "gray" }}
                    type="text"
                  />
                </Flex>
                <Flex direction="column" w={"full"}>
                  <Text>{t('link')}</Text>
                  <Input
                    value={inputs.link}
                    onChange={(e) => {
                      setInputs({ ...inputs, link: e.target.value });
                    }}
                    placeholder={t('addLink')}
                    variant={"flushed"}
                    _placeholder={{ color: "gray" }}
                    type="text"
                  />
                </Flex>
              </VStack>
            </Flex>
          </ModalBody>
          <ModalFooter>
            <Button
              bg={useColorModeValue("black", "white")}
              color={useColorModeValue("white", "black")}
              w="full"
              _hover={"none"}
              onClick={handleSubmit}
              isLoading={updating}
            >
              {t('done')}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UpdateProfileModal;
