import { Flex, useColorMode, Link, Box, useBreakpointValue } from "@chakra-ui/react";
import { Image } from "@chakra-ui/react";
import { BsHeart } from "react-icons/bs";
import { FiLogOut } from "react-icons/fi";
import { LuPenSquare } from "react-icons/lu";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { BsFillChatSquareQuoteFill } from "react-icons/bs";
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

    const iconSize = useBreakpointValue({ base: 6, md: 8, lg: 10 });

    const iconStyles = {
        boxSize: iconSize,
        className: isDarkMode ? "icon-container" : "icon-container_light"
    };

    return (
        <Flex justifyContent="center" gap={4} mt={4} mb={8} wrap="nowrap" flexGrow={1}>
            {user && (
                <Link as={RouterLink} to="/">
                    <Box as={GrHomeRounded} {...iconStyles} />
                </Link>
            )}

            {!user && (
                <Link as={RouterLink} to="/" onClick={() => setAuthScreen("login")}>
                    Login
                </Link>
            )}

            {user && (
                <Link as={RouterLink} to="/chat">
                    <Box as={BsFillChatSquareQuoteFill} {...iconStyles} />
                </Link>
            )}
            {/* {user && (
                <Link as={RouterLink} to="/chat">
                    <Box as={BsFillChatSquareQuoteFill} {...iconStyles} />
                </Link>
            )} */}
            <Image
                cursor="pointer"
                alt="logo"
                {...iconStyles}
                src={colorMode === "dark" ? "/light-logo.svg" : "/dark-logo.svg"}
                onClick={toggleColorMode}
            />

            <Link as={RouterLink} to="/search">
                <Box as={SearchIcon} {...iconStyles} />
            </Link>

            <Box as={LuPenSquare} {...iconStyles} />
            <Box as={BsHeart} {...iconStyles} strokeWidth={0.3} />

            {user && (
                <Flex alignItems="center" gap={4}>
                    <Link as={RouterLink} to={`/${user.username}`}>
                        <Box as={FaRegUser} {...iconStyles} cursor="pointer" />
                    </Link>
                </Flex>
            )}

            {!user && (
                <Link as={RouterLink} to="/auth" onClick={() => setAuthScreen("signup")}>
                    Sign up
                </Link>
            )}

            {user && (
                <Box
                    as={FiLogOut}
                    {...iconStyles}
                    onClick={logout}
                    cursor="pointer"
                />
            )}
        </Flex>
    );
};

export default Header;
