import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  HStack,
  InputRightElement,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
  Link,
  FormErrorMessage,
} from "@chakra-ui/react";
import { useState } from "react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import authScreenAtom from "../atoms/authAtom";
import { useSetRecoilState } from "recoil";
import useShowToast from "../hooks/useShowToast";
import userAtom from "../atoms/userAtom";
import { z } from "zod";
import { signupSchema } from "../lib/validations";

export default function SignupCard() {
  const [showPassword, setShowPassword] = useState(false);
  const setScreenAuth = useSetRecoilState(authScreenAtom);

  const showToast = useShowToast();
  const [errors, setErrors] = useState({});
  const setUser = useSetRecoilState(userAtom);

  const [inputs, setInputs] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
  });
  const handleSignup = async () => {
    try {
      const parsedInputs = signupSchema.parse(inputs);

      const res = await fetch("/api/users/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(parsedInputs),
      });
      const data = await res.json();
      if (data.error) {
        setErrors({ username: data.error });
        showToast("An error occurred.", data.error, "error");
        return;
      }
      localStorage.setItem("user-threads", JSON.stringify(data));
      setUser(data);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors = error.errors.reduce((acc, e) => {
          acc[e.path[0]] = e.message;
          return acc;
        }, {});
        setErrors(newErrors);
      } else {
        showToast("An error occurred.", error, "error");
      }
    }
  };
  return (
    <Flex align={"center"} justify={"center"}>
      <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
        <Stack align={"center"}>
          <Heading fontSize={"4xl"} textAlign={"center"}>
            Sign up
          </Heading>
        </Stack>
        <Box rounded={"lg"} bg={useColorModeValue("white", "gray.dark")} boxShadow={"lg"} p={8}>
          <Stack spacing={4}>
            <HStack>
              <Box>
                <FormControl isRequired isInvalid={errors.name}>
                  <FormLabel>Full name</FormLabel>
                  <Input
                    type="text"
                    onChange={(e) => {
                      setInputs({ ...inputs, name: e.target.value });
                      setErrors({ ...errors, name: "" });
                    }}
                    value={inputs.name}
                  />
                  {errors.name && <FormErrorMessage>{errors.name}</FormErrorMessage>}
                </FormControl>
              </Box>
              <Box>
                <FormControl isRequired isInvalid={errors.username}>
                  <FormLabel>Username</FormLabel>
                  <Input
                    type="text"
                    onChange={(e) => {
                      setInputs({ ...inputs, username: e.target.value });
                      setErrors({ ...errors, username: "" });
                    }}
                    value={inputs.username}
                  />
                  {errors.username && <FormErrorMessage>{errors.username}</FormErrorMessage>}
                </FormControl>
              </Box>
            </HStack>
            <FormControl isRequired isInvalid={errors.email}>
              <FormLabel>Email address</FormLabel>
              <Input
                type="email"
                onChange={(e) => {
                  setInputs({ ...inputs, email: e.target.value });
                  setErrors({ ...errors, email: "" });
                }}
                value={inputs.email}
              />
              {errors.email && <FormErrorMessage>{errors.email}</FormErrorMessage>}
            </FormControl>
            <FormControl isRequired isInvalid={errors.password}>
              <FormLabel>Password</FormLabel>
              <InputGroup>
                <Input
                  type={showPassword ? "text" : "password"}
                  onChange={(e) => {
                    setInputs({ ...inputs, password: e.target.value });
                    setErrors({ ...errors, password: "" });
                  }}
                  value={inputs.password}
                />

                <InputRightElement h={"full"}>
                  <Button variant={"ghost"} onClick={() => setShowPassword((showPassword) => !showPassword)}>
                    {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                  </Button>
                </InputRightElement>
              </InputGroup>
              {errors.password && <FormErrorMessage>{errors.password}</FormErrorMessage>}
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
                onClick={handleSignup}
              >
                Sign up
              </Button>
            </Stack>
            <Stack pt={6}>
              <Text align={"center"}>
                Already a user?{" "}
                <Link
                  color={useColorModeValue("gray.700", "gray.100")}
                  onClick={() => {
                    setScreenAuth("login");
                  }}
                >
                  Login
                </Link>
              </Text>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
}
