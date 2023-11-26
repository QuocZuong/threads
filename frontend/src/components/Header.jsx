import { Flex, Image, useColorMode, Link } from "@chakra-ui/react";
import { useRecoilValue } from "recoil";
import { AiFillHome } from "react-icons/ai";
import { RxAvatar } from "react-icons/rx";
import userAtom from "../atoms/userAtom";
import { Link as RouterLink } from "react-router-dom";
const Header = () => {
    const { colorMode, toggleColorMode } = useColorMode();
    const user = useRecoilValue(userAtom);

    return (
        <Flex justifyContent={"center"} gap={20} mt={6} mb={12}>
            {user && (
                <Link as={RouterLink} to="/">
                    <AiFillHome size={24} />
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
                <Link as={RouterLink} to={`/${user.username}`}>
                    <RxAvatar size={24} />
                </Link>
            )}
        </Flex>
    );
};

export default Header;
