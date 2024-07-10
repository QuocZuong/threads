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
  FormErrorMessage,
} from "@chakra-ui/react";
import { useState } from "react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { useSetRecoilState } from "recoil";
import authScreenAtom from "../atoms/authAtom";
import useShowToast from "../hooks/useShowToast";
import userAtom from "../atoms/userAtom";
import { z } from "zod";
import { loginSchema } from "../lib/validations";
import { useTranslation } from "react-i18next";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const setAuthScreen = useSetRecoilState(authScreenAtom);
  const showToast = useShowToast();
  const setUser = useSetRecoilState(userAtom);
  const [errors, setErrors] = useState({});
  const {t} = useTranslation();
  const [inputs, setInputs] = useState({
    username: "",
    password: "",
  });

  const handleLogin = async () => {
    setIsLoading(true);
    setErrors({});
    try {
      const parsedInputs = loginSchema.parse(inputs);

      const res = await fetch("/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(parsedInputs),
      });

      const data = await res.json();

      if (data.error) {
        setErrors;
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
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Flex align={"center"} justify={"center"}>
      <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
        <Stack align={"center"}>
          <Heading fontSize={"4xl"} textAlign={"center"}>
            {t("login")}
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
            <FormControl isRequired isInvalid={errors.username}>
              <FormLabel>{t("userName")}</FormLabel>
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
            <FormControl isRequired isInvalid={errors.password}>
              <FormLabel>{t("passWord")}</FormLabel>
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
                isLoading={isLoading}
                loadingText="Logging in"
                size="lg"
                bg={useColorModeValue("gray.600", "gray.700")}
                color={"white"}
                _hover={{
                  bg: useColorModeValue("gray.700", "gray.600"),
                }}
                onClick={handleLogin}
              >
                {t("login")}
              </Button>
            </Stack>
            <Stack pt={6}>
              <Text align={"center"}>
                {t("dont_have_account")}{" "}
                <Link color={useColorModeValue("gray.700", "gray.100")} onClick={() => setAuthScreen("signup")}>
                  {t("signUp")}
                </Link>
              </Text>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
}
