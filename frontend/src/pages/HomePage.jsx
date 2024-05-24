import { Flex, Spinner } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import useShowToast from "../hooks/useShowToast";
import Post from "../components/Post";
import { useRecoilState } from "recoil";
import postsAtom from "../atoms/postsAtom";
// import { Box} from "@chakra-ui/layout";
// import { Avatar } from "@chakra-ui/avatar";
import CreatePost from "../components/CreatePost";
const HomePage = () => {
    const [posts, setPosts] = useRecoilState(postsAtom);
    const [isLoading, setIsLoading] = useState(true);
    const showToast = useShowToast();
    useEffect(() => {
        const getFeedPosts = async () => {
            setIsLoading(true);
            setPosts([]);
            try {
                const res = await fetch("/api/posts/feed");
                const data = await res.json();

                if (res.status === 500) {
                    showToast("Error", data.message, "error");
                    return;
                }

                if (data.error) {
                    showToast("Error", data.error, "error");
                    return;
                }
                setPosts(data);
            } catch (error) {
                showToast("Error", "Error while loading feed", "error");
            } finally {
                setIsLoading(false);
            }
        };
        document.title = "Home";
        getFeedPosts();
    }, [showToast, setPosts]);

    return (
        <>
            {isLoading && (
                <Flex justifyContent={"center"}>
                    <Spinner size={"xl"} />
                </Flex>
            )}
            <CreatePost />
        
            {!isLoading && posts?.length === 0 && <h1>Follow some user to see the feed</h1>}

            {posts?.length > 0 &&
                posts?.map((post) => {
                    return <Post key={post._id} post={post} postedBy={post.postedBy} setPosts={setPosts}></Post>;
                })}
        </>
    );
};

export default HomePage;
