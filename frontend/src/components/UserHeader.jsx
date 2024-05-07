import { Avatar } from "@chakra-ui/avatar";
import { Box, VStack, Flex, Text, Link } from "@chakra-ui/layout";
// import { Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/menu";
import {  Button } from "@chakra-ui/react";
// import { Portal } from "@chakra-ui/portal";
import { BsInstagram } from "react-icons/bs";
// import { CgMoreO } from "react-icons/cg";
import useShowToast from "../hooks/useShowToast";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import { Link as RouterLink } from "react-router-dom";
import { useState } from "react";

const UserHeader = ({ user }) => {
    const showToast = useShowToast();
    const currentUser = useRecoilValue(userAtom);
    const [following, setFollowing] = useState(user?.followers.includes(currentUser?._id));
    const [updating, setUpdating] = useState(false);
    const isDarkMode = localStorage.getItem("chakra-ui-color-mode") === "dark";

    /* copy function when click on button */
    // const copyURL = () => {
    //     const currentURL = window.location.href;
    //     navigator.clipboard.writeText(currentURL).then(() => {
    //         showToast("Profile copied.", "", "success");
    //     });
    // };

    const handleFollowUnfollow = async () => {
        if (!currentUser) {
            showToast("Error", "Please login to follow", "error");
            return;
        }
        setUpdating(true);
        try {
            const res = await fetch(`/api/users/follow/${user._id}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const data = await res.json();

            if (data.error) {
                showToast("An error occurred.", data.error, "error");
                return;
            }

            if (following) {
                showToast("Success", `Unfollowed ${user?.name}`, "success");
                user.followers.pop();
            } else {
                showToast("Success", `Followed ${user?.name}`, "success");
                user.followers.push(currentUser?._id);
            }

            setFollowing((prev) => !prev);
        } catch (error) {
            showToast("Error", error, "error");
        } finally {
            setUpdating(false);
        }
    };

    return (
        <VStack gap={4} alignItems={"start"}>
            <Flex justifyContent={"space-between"} w={"full"}>
                <Box>
                    <Text fontSize={"2xl"} fontWeight={"bold"}>
                        {user?.name}
                    </Text>
                    <Flex gap={2} alignItems={"center"}>
                        <Text fontSize={"sm"}>{user?.username}</Text>
                        {/* <Text
                            fontSize={"xs"}
                            bg={useColorModeValue("gray.300", "gray.dark")}
                            color={"gray.light"}
                            p={1}
                            borderRadius={"full"}
                        >
                            threads.net
                        </Text> */}
                    </Flex>
                </Box>
                <Box>
                    <Avatar
                        size={{
                            base: "md",
                            md: "xl",
                        }}
                        name={user?.name}
                        src={user?.profilePic}
                    />
                </Box>
            </Flex>

            <Text>{user?.bio}</Text>
{/* 
            {currentUser?._id === user._id && (
                <Link as={RouterLink} to="/update">
                    <Button>Update profile</Button>
                </Link>
            )} */}

            {currentUser?._id !== user._id && (
                <Button onClick={handleFollowUnfollow} isLoading={updating}>
                    {following ? "Unfollow" : "Follow"}
                </Button>
            )}

            <Flex w={"full"} justifyContent={"space-between"}>
                <Flex gap={2} alignItems={"center"}>
                    <Text color={"gray.light"}>{user?.followers.length} followers</Text>
                    {/* <Box w={1} h={1} bg={"gray.light"} borderRadius={"full"}></Box> */}
                    {/* <Link color={"gray.light"} cursor={"pointer"}>
                        instagram.com
                    </Link> */}
                </Flex>
                <Flex gap={2} alignItems={"center"}>
                    <Box className={isDarkMode ? "icon-container" : "icon-container_light"}>
                        <BsInstagram size={24} cursor={"pointer"} />
                    </Box>
                    {/* <Box className={isDarkMode ? "icon-container" : "icon-container_light"}>
                        <Menu>
                            <MenuButton>
                                <CgMoreO size={24} cursor={"pointer"} />
                            </MenuButton>
                            <Portal>
                                <MenuList bg={"gray.dark"}>
                                    <MenuItem bg={"gray.dark"} onClick={copyURL}>
                                        Copy link
                                    </MenuItem>
                                </MenuList>
                            </Portal>
                        </Menu>
                    </Box> */}
                </Flex>
            </Flex>
            {currentUser?._id === user._id && (
                <Link as={RouterLink} to="/update">
                    <Button>Update profile</Button>
                </Link>
            )}
{/* width: 588px;
    border: groove 0.05px gray;
    background: none; */}
            <Flex w={"full"}>
                <Flex flex={1} borderBottom={"1px solid white"} justifyContent={"center"} pb={3} cursor={"pointer"}>
                    <Text fontWeight={"bold"}>Threads</Text>
                </Flex>
                <Flex
                    flex={1}
                    borderBottom={"1px solid gray"}
                    justifyContent={"center"}
                    color={"gray.light"}
                    pb={3}
                    cursor={"pointer"}
                >
                    <Text fontWeight={"bold"}>Replies</Text>
                </Flex>
            </Flex>
        </VStack>
    );
};

export default UserHeader;
