import {
    Flex,
    Box,
    FormControl,
    FormLabel,
    Input,
    InputGroup,
    InputRightElement,
    Stack,
    Button,
    Heading,
    Text,
    useColorModeValue,
    Link,
} from "@chakra-ui/react";
import { useState } from "react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { useSetRecoilState } from "recoil";
import authScreenAtom from "../atoms/authAtom";
import useShowToast from "../hooks/useShowToast";
import userAtom from "../atoms/userAtom";

export default function Login() {
    const [showPassword, setShowPassword] = useState(false);
    const setAuthScreen = useSetRecoilState(authScreenAtom);
    const showToast = useShowToast();
    const setUser = useSetRecoilState(userAtom);

    const [inputs, setInputs] = useState({
        username: "",
        password: "",
    });

    const handleLogin = async () => {
        try {
            const res = await fetch("/api/users/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(inputs),
            });

            const data = await res.json();

            if (data.error) {
                showToast("An error occurred.", data.error, "error");
                return;
            }
            localStorage.setItem("user-threads", JSON.stringify(data));
            setUser(data);
        } catch (error) {
            showToast("An error occurred.", error, "error");
        }
    };
    return (
        <Flex align={"center"} justify={"center"}>
            <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
                <Stack align={"center"}>
                    <Heading fontSize={"4xl"} textAlign={"center"}>
                        Login
                    </Heading>
                </Stack>
                <Box
                    w={{
                        base: "full",
                        sm: "400px",
                    }}
                    rounded={"lg"}
                    bg={useColorModeValue("white", "gray.dark")}
                    boxShadow={"lg"}
                    p={8}
                >
                    <Stack spacing={4}>
                        <FormControl isRequired>
                            <FormLabel>Username</FormLabel>
                            <Input
                                type="text"
                                onChange={(e) => {
                                    setInputs({ ...inputs, username: e.target.value });
                                }}
                                value={inputs.username}
                            />
                        </FormControl>
                        <FormControl isRequired>
                            <FormLabel>Password</FormLabel>
                            <InputGroup>
                                <Input
                                    type={showPassword ? "text" : "password"}
                                    onChange={(e) => {
                                        setInputs({ ...inputs, password: e.target.value });
                                    }}
                                    value={inputs.password}
                                />
                                <InputRightElement h={"full"}>
                                    <Button
                                        variant={"ghost"}
                                        onClick={() => setShowPassword((showPassword) => !showPassword)}
                                    >
                                        {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                                    </Button>
                                </InputRightElement>
                            </InputGroup>
                        </FormControl>
                        <Stack spacing={10} pt={2}>
                            <Button
                                loadingText="Submitting"
                                size="lg"
                                bg={useColorModeValue("gray.600", "gray.700")}
                                color={"white"}
                                _hover={{
                                    bg: useColorModeValue("gray.700", "gray.600"),
                                }}
                                onClick={handleLogin}
                            >
                                Login
                            </Button>
                        </Stack>
                        <Stack pt={6}>
                            <Text align={"center"}>
                                Don&apos;t have an account?{" "}
                                <Link
                                    color={useColorModeValue("gray.700", "gray.100")}
                                    onClick={() => setAuthScreen("signup")}
                                >
                                    Sign up
                                </Link>
                            </Text>
                        </Stack>
                    </Stack>
                </Box>
            </Stack>
        </Flex>
    );
}
