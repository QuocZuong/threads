import { Flex, useColorMode, Link, Box, Image, useBreakpointValue } from "@chakra-ui/react";
import { BsHeart } from "react-icons/bs";
import { FiLogOut } from "react-icons/fi";
import { LuPenSquare } from "react-icons/lu";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { GrHomeRounded } from "react-icons/gr";
import { FaRegUser } from "react-icons/fa6";
import userAtom from "../atoms/userAtom";
import { Link as RouterLink } from "react-router-dom";
import useLogout from "../hooks/useLogout";
import { SearchIcon } from "@chakra-ui/icons";
import "../components/Header.css";
import authScreenAtom from "../atoms/authAtom";
import { IoChatbubblesOutline } from "react-icons/io5";
import { useTranslation } from "react-i18next";

const Header = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const user = useRecoilValue(userAtom);
  const logout = useLogout();
  const setAuthScreen = useSetRecoilState(authScreenAtom);
  const isDarkMode = localStorage.getItem("chakra-ui-color-mode") === "dark";
  
  const iconSize = useBreakpointValue({ base: "30px", md: "35px", lg: "40px" });
  const gapSize = useBreakpointValue({ base: 2, md: 4, lg: 6 });
  const {t} = useTranslation();
  return (
    <Flex justifyContent={"center"} alignItems="center" gap={gapSize} mt={4} mb={8} wrap="wrap" flexDirection="row">
      {user && (
        <Link as={RouterLink} to="/">
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            boxSize={iconSize}
            className={isDarkMode ? "icon-container" : "icon-container_light"}
          >
            <GrHomeRounded style={{ width: "100%", height: "100%" }} />
          </Box>
        </Link>
      )}

      {!user && (
        <Link
          className={isDarkMode ? "icon-containerSignup" : "icon-container_lightSignup"}
          as={RouterLink}
          to="/"
          style={{ textDecoration: "none" }}
          onClick={() => setAuthScreen("login")}
        >
          {t("login")}
        </Link>
      )}

      {user && (
        <Link as={RouterLink} to="/chat">
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            boxSize={iconSize}
            className={isDarkMode ? "icon-container" : "icon-container_light"}
          >
            <IoChatbubblesOutline style={{ width: "100%", height: "120%" }} />
          </Box>
        </Link>
      )}

      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        cursor={"pointer"}
        w={iconSize}
        h={iconSize}
        onClick={toggleColorMode}
        className={isDarkMode ? "icon-container" : "icon-container_light"}
      >
        <Image alt="logo" src={colorMode === "dark" ? "/light-logo.svg" : "/dark-logo.svg"} boxSize="100%" />
      </Box>
      {user && (
          <Link as={RouterLink} to="/search">
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              boxSize={iconSize}
              className={isDarkMode ? "icon-container" : "icon-container_light"}
            >
              <SearchIcon
                style={{ width: "100%", height: "100%" }}
                className={isDarkMode ? "icon-container" : "icon-container_light"}
              />
            </Box>
          </Link>
      )}
      {user && (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            boxSize={iconSize}
            className={isDarkMode ? "icon-container" : "icon-container_light"}
          >
            <LuPenSquare
              style={{ width: "100%", height: "100%" }}
              className={isDarkMode ? "icon-container" : "icon-container_light"}
            />
          </Box>
      
      )}
      {user && (
        <BsHeart size={50} strokeWidth={0.3} className={isDarkMode ? "icon-container" : "icon-container_light"} />
      )}
      {user && (
        <Flex alignItems={"center"} gap={gapSize}>
          <Link as={RouterLink} to={`/${user.username}`}>
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              boxSize={iconSize}
              className={isDarkMode ? "icon-container" : "icon-container_light"}
              cursor={"pointer"}
            >
              <FaRegUser style={{ width: "100%", height: "100%" }} />
            </Box>
          </Link>
        </Flex>
      )}

      {!user && (
        <Link
          className={isDarkMode ? "icon-containerSignup" : "icon-container_lightSignup"}
          as={RouterLink}
          to="/auth"
          onClick={() => setAuthScreen("signup")}
        >
          {t("signUp")}
        </Link>
      )}

      {user && (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          boxSize={iconSize}
          className={isDarkMode ? "icon-container" : "icon-container_light"}
          onClick={logout}
          cursor={"pointer"}
        >
          <FiLogOut style={{ width: "100%", height: "100%" }} />
        </Box>
      )}
    </Flex>
  );
};

export default Header;
