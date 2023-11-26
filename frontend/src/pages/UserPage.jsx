import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import UserHeader from "../components/UserHeader";
import UserPost from "../components/UserPost";
import useShowToast from "../hooks/useShowToast.js";
import { Spinner, Flex } from "@chakra-ui/react";

const UserPage = () => {
    const [user, setUser] = useState(null);
    const { username } = useParams();
    const showToast = useShowToast();
    const [isLoading, setIsLoading] = useState(false);
    useEffect(() => {
        const getUser = async () => {
            setIsLoading(true);
            try {
                const res = await fetch(`/api/users/${username}`);
                const data = await res.json();

                if (data.error) {
                    showToast("Error", data.error, "error");
                    return;
                }
                setUser(data);
            } catch (error) {
                showToast("Error", error.message, "error");
            } finally {
                setIsLoading(false);
            }
        };
        getUser();
    }, [username, showToast]);

    if (!user && isLoading) {
        return (
            <Flex justifyContent={"center"}>
                <Spinner size={"xl"} />
            </Flex>
        );
    }

    if (!user && !isLoading) return <h1>User not found</h1>;

    return (
        <>
            <UserHeader user={user} />
            <UserPost likes={1200} replies={320} postImg="/post1.png" postTitle="This is my first post" />
            <UserPost likes={1200} replies={320} postImg="/post2.png" postTitle="Hello fiends" />
            <UserPost likes={1100} replies={3320} postImg="/post3.png" postTitle="Zuong day" />
            <UserPost likes={16700} replies={2345} postImg="/post1.png" postTitle="T1 mai dinh" />
        </>
    );
};

export default UserPage;
