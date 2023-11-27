import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import UserHeader from "../components/UserHeader";
import useShowToast from "../hooks/useShowToast.js";
import { Spinner, Flex } from "@chakra-ui/react";
import Post from "../components/Post.jsx";

const UserPage = () => {
    const [user, setUser] = useState(null);
    const { username } = useParams();
    const showToast = useShowToast();
    const [isLoading, setIsLoading] = useState(false);
    const [posts, setPosts] = useState([]);
    const [fetchingPost, setFetchingPost] = useState(true);
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

        const getPosts = async () => {
            setFetchingPost(true);
            try {
                const res = await fetch(`/api/posts/user/${username}`);
                const data = await res.json();
                if (data.error) {
                    showToast("Error", data.error, "error");
                }
                setPosts(data);
            } catch (error) {
                showToast("Error", error.message, "error");
            } finally {
                setFetchingPost(false);
            }
        };

        getUser();
        getPosts();
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
            {!fetchingPost && posts.length === 0 && <h1>User has no post</h1>}

            {/* {fetchingPost && (
                <Flex justifyContent={"center"} my={12}>
                    <Spinner size={"xl"} />
                </Flex>
            )} */}

            {posts.map((post) => (
                <Post key={post._id} post={post} postedBy={post.postedBy} />
            ))}
        </>
    );
};

export default UserPage;
