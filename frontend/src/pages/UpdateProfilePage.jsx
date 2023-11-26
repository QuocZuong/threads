import { useState, useRef } from "react";
import { useRecoilState } from "recoil";
import userAtom from "../atoms/userAtom.js";
import {
    Button,
    Flex,
    FormControl,
    FormLabel,
    Heading,
    Input,
    Stack,
    useColorModeValue,
    Avatar,
    Center,
} from "@chakra-ui/react";
import usePreviewImg from "../hooks/usePreviewImg";
import useShowToast from "../hooks/useShowToast.js";

export default function UpdateProfilePage() {
    const [user, setUser] = useRecoilState(userAtom);
    const fileRef = useRef(null);
    const { handleImageChange, imgUrl } = usePreviewImg();
    const [updating, setUpdating] = useState(false);
    const showToast = useShowToast();

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
        } catch (error) {
            showToast("Error", error.message, "error");
        } finally {
            setUpdating(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <Flex align={"center"} justify={"center"}>
                <Stack
                    spacing={4}
                    w={"full"}
                    maxW={"md"}
                    bg={useColorModeValue("white", "gray.dark")}
                    rounded={"xl"}
                    boxShadow={"lg"}
                    p={6}
                    my={6}
                >
                    <Heading lineHeight={1.1} fontSize={{ base: "2xl", sm: "3xl" }}>
                        User Profile Edit
                    </Heading>
                    <FormControl>
                        <Stack direction={["column", "row"]} spacing={6}>
                            <Center>
                                <Avatar size="xl" src={imgUrl || inputs.profilePic} />
                            </Center>
                            <Center w="full">
                                <Button w="full" onClick={() => fileRef.current.click()}>
                                    Change Avatar
                                </Button>
                                <Input type={"file"} hidden ref={fileRef} onChange={handleImageChange}></Input>
                            </Center>
                        </Stack>
                    </FormControl>
                    <FormControl>
                        <FormLabel>Full name</FormLabel>
                        <Input
                            value={inputs.name}
                            onChange={(e) => {
                                setInputs({ ...inputs, name: e.target.value });
                            }}
                            placeholder="Your full name"
                            _placeholder={{ color: "gray.500" }}
                            type="text"
                        />
                    </FormControl>
                    <FormControl>
                        <FormLabel>Username</FormLabel>
                        <Input
                            value={inputs.username}
                            onChange={(e) => {
                                setInputs({ ...inputs, username: e.target.value });
                            }}
                            placeholder="username"
                            _placeholder={{ color: "gray.500" }}
                            type="text"
                        />
                    </FormControl>
                    <FormControl>
                        <FormLabel>Email address</FormLabel>
                        <Input
                            value={inputs.email}
                            onChange={(e) => {
                                setInputs({ ...inputs, email: e.target.value });
                            }}
                            placeholder="your-email@example.com"
                            _placeholder={{ color: "gray.500" }}
                            type="email"
                        />
                    </FormControl>
                    <FormControl>
                        <FormLabel>Bio</FormLabel>
                        <Input
                            value={inputs.bio}
                            onChange={(e) => {
                                setInputs({ ...inputs, bio: e.target.value });
                            }}
                            placeholder="Bio"
                            _placeholder={{ color: "gray.500" }}
                            type="text"
                        />
                    </FormControl>
                    <FormControl>
                        <FormLabel>Password</FormLabel>
                        <Input
                            value={inputs.password}
                            onChange={(e) => {
                                setInputs({ ...inputs, password: e.target.value });
                            }}
                            placeholder="password"
                            _placeholder={{ color: "gray.500" }}
                            type="password"
                        />
                    </FormControl>
                    <Stack spacing={6} direction={["column", "row"]}>
                        {/* <Button
                            bg={"red.400"}
                            color={"white"}
                            w="full"
                            _hover={{
                                bg: "red.500",
                            }}
                        >
                            Cancel
                        </Button> */}
                        <Button
                            bg={"green.400"}
                            color={"white"}
                            w="full"
                            _hover={{
                                bg: "green.500",
                            }}
                            type="submit"
                            isLoading={updating}
                        >
                            Submit
                        </Button>
                    </Stack>
                </Stack>
            </Flex>
        </form>
    );
}
