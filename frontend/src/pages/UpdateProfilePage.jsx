import { useState, useRef, useEffect } from "react";
import { useRecoilState } from "recoil";
import userAtom from "../atoms/userAtom.js";
import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Stack,
  useColorModeValue,
  Avatar,
  HStack,
  // Switch,
  // extendTheme,
  Box,
  Divider,
  Text,
} from "@chakra-ui/react";
import usePreviewImg from "../hooks/usePreviewImg";
import useShowToast from "../hooks/useShowToast.js";
// import { switchTheme } from "../lib/theme.js";
import { CiLock } from "react-icons/ci";

export default function UpdateProfilePage() {
  const [user, setUser] = useRecoilState(userAtom);
  const fileRef = useRef(null);
  const { handleImageChange, imgUrl } = usePreviewImg();
  const [updating, setUpdating] = useState(false);
  const showToast = useShowToast();
  // const theme = extendTheme({ components: { switchTheme }, })

  const [inputs, setInputs] = useState({
    name: user.name,
    username: user.username,
    email: user.email,
    bio: user.bio,
    password: "",
    profilePic: user.profilePic,
    // privateProfile: user.privateProfile || false,
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
    <form onSubmit={handleSubmit}>
      <Flex align={"center"} justify={"center"}>
        <Stack
          spacing={4}
          w={"full"}
          maxW={"md"}
          bg={useColorModeValue("white", "#181818")}
          rounded={"xl"}
          boxShadow={"lg"}
          p={6}
          my={20}
          border={"1.5px solid"}
          borderColor={useColorModeValue("white", "#2e2e2e")}
        >
          <HStack direction={["column", "row"]} spacing={4} justify={"space-between"}>
            <Flex direction="column" w={"80%"}>
              <FormLabel>Name</FormLabel>
              <HStack pb={3}>
                <CiLock color="gray.300" />
                <Text>{`${inputs.name} (${inputs.username})`}</Text>
              </HStack>
              <Divider />
            </Flex>
            <Flex direction="column" align="center">
              <FormControl>
                <Box w={50}>
                  <Button w={10} onClick={() => fileRef.current.click()}>
                    <Avatar size="lg" src={imgUrl || inputs.profilePic} />
                  </Button>
                  <Input type={"file"} hidden ref={fileRef} onChange={handleImageChange}></Input>
                </Box>
              </FormControl>
            </Flex>
          </HStack>

          <FormControl>
            <FormLabel>Bio</FormLabel>
            <Input
              value={inputs.bio}
              onChange={(e) => {
                setInputs({ ...inputs, bio: e.target.value });
              }}
              placeholder="+ Add bio"
              variant={"flushed"}
              _placeholder={{ color: "gray" }}
              type="text"
            />
          </FormControl>
          <FormControl>
            <FormLabel>Link</FormLabel>
            <Input
              value={inputs.link}
              onChange={(e) => {
                setInputs({ ...inputs, link: e.target.value });
              }}
              placeholder="+ Add link"
              variant={"flushed"}
              _placeholder={{ color: "gray" }}
              type="text"
            />
          </FormControl>
          {/* <FormControl display="flex" alignItems="center">
            <Flex justify="space-between" w="full" pb={3}>
              <FormLabel mb="0">Private profile</FormLabel>
              <Switch
                isChecked={inputs.privateProfile}
                onChange={(e) => setInputs({ ...inputs, privateProfile: e.target.checked })}
                size='lg'
                colorScheme={useColorModeValue("blackAlpha", "whiteAlpha")}
              />
            </Flex>
          </FormControl> */}
          <Stack spacing={6} direction={["column", "row"]}>
            <Button
              bg={useColorModeValue("black", "white")}
              color={useColorModeValue("white", "black")}
              w="full"
              _hover={"none"}
              type="submit"
              isLoading={updating}
            >
              Done
            </Button>
          </Stack>
        </Stack>
      </Flex>
    </form>
  );
}
