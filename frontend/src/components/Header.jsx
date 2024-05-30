import { Flex, useColorMode, Link } from "@chakra-ui/react";
import { Image } from "@chakra-ui/react";
import { FiSearch } from "react-icons/fi";
import { BsHeart } from "react-icons/bs";
import { FiLogOut } from "react-icons/fi";
import { LuPenSquare } from "react-icons/lu";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { AiFillHome } from "react-icons/ai";
import { BsFillChatSquareQuoteFill } from "react-icons/bs";
import { RxAvatar } from "react-icons/rx";
import { GrHomeRounded } from "react-icons/gr";
import { FaRegUser } from "react-icons/fa6";
import userAtom from "../atoms/userAtom";
import { Link as RouterLink } from "react-router-dom";
import useLogout from "../hooks/useLogout";
import { SearchIcon } from "@chakra-ui/icons";

import authScreenAtom from "../atoms/authAtom";
const Header = () => {
    const { colorMode, toggleColorMode } = useColorMode();
    const user = useRecoilValue(userAtom);
    const logout = useLogout();
    const setAuthScreen = useSetRecoilState(authScreenAtom);
    const isDarkMode = localStorage.getItem("chakra-ui-color-mode") === "dark";

    return (
        <Flex justifyContent={"center"} gap={10} mt={4} mb={8}>
            {user && (
                <Link as={RouterLink} to="/">
                    <GrHomeRounded size={50} className={isDarkMode ? "icon-container" : "icon-container_light"} />
                </Link>
            )}

            {!user && (
                <Link as={RouterLink} to="/" onClick={() => setAuthScreen("login")}>
                    Login
                </Link>
            )}

            {user && (
                <Link as={RouterLink} to="/chat">
                    <BsFillChatSquareQuoteFill
                        size={35}
                        className={isDarkMode ? "icon-container" : "icon-container_light"}
                    />
                </Link>
            )}
            <Image
                cursor={"pointer"}
                alt="logo"
                w={50}
                src={colorMode === "dark" ? "/light-logo.svg" : "/dark-logo.svg"}
                className={isDarkMode ? "icon-container" : "icon-container_light"}
                onClick={toggleColorMode}
            />
            <RouterLink to="/search">
                <SearchIcon
                    boxSize={35}
                    className={isDarkMode ? "icon-container" : "icon-container_light"}
                ></SearchIcon>
            </RouterLink>
            <LuPenSquare size={50} className={isDarkMode ? "icon-container" : "icon-container_light"} />
            <BsHeart size={50} strokeWidth={0.3} className={isDarkMode ? "icon-container" : "icon-container_light"} />
            {user && (
                <Flex alignItems={"center"} gap={4}>
                    <Link as={RouterLink} to={`/${user.username}`}>
                        <FaRegUser
                            size={24}
                            className={isDarkMode ? "icon-container" : "icon-container_light"}
                            cursor={"pointer"}
                        />
                    </Link>
                </Flex>
            )}

            {!user && (
                <Link as={RouterLink} to="/auth" onClick={() => setAuthScreen("signup")}>
                    Sign up
                </Link>
            )}
            {user && (
                <FiLogOut
                    size={35}
                    className={isDarkMode ? "icon-container" : "icon-container_light"}
                    onClick={logout}
                    cursor={"pointer"}
                />
            )}
        </Flex>
    );
};

export default Header;
