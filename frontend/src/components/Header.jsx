import { Flex, Image, useColorMode, Link, Button } from "@chakra-ui/react";
import { FiLogOut } from "react-icons/fi";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { AiFillHome } from "react-icons/ai";
import { RxAvatar } from "react-icons/rx";
import userAtom from "../atoms/userAtom";
import { Link as RouterLink } from "react-router-dom";
import useLogout from "../hooks/useLogout";
import authScreenAtom from "../atoms/authAtom";
const Header = () => {
    const { colorMode, toggleColorMode } = useColorMode();
    const user = useRecoilValue(userAtom);
    const logout = useLogout();
    const setAuthScreen = useSetRecoilState(authScreenAtom);
    return (
        <Flex justifyContent={"center"} gap={20} mt={6} mb={12}>
            {user && (
                <Link as={RouterLink} to="/">
                    <AiFillHome size={24} />
                </Link>
            )}

            {!user && (
                <Link as={RouterLink} to="/" onClick={() => setAuthScreen("login")}>
                    Login
                </Link>
            )}

            <Image
                cursor={"pointer"}
                alt="logo"
                w={6}
                src={colorMode === "dark" ? "/light-logo.svg" : "/dark-logo.svg"}
                onClick={toggleColorMode}
            ></Image>

            {user && (
                <Flex alignItems={"center"} gap={4}>
                    <Link as={RouterLink} to={`/${user.username}`}>
                        <RxAvatar size={24} />
                    </Link>
                    <Button size={"xs"} onClick={logout}>
                        <FiLogOut size={20} />
                    </Button>
                </Flex>
            )}

            {!user && (
                <Link as={RouterLink} to="/auth" onClick={() => setAuthScreen("signup")}>
                    Sign up
                </Link>
            )}
        </Flex>
    );
};

export default Header;
