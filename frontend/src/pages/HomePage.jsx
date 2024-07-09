import { Flex, Spinner } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import useShowToast from "../hooks/useShowToast";
import Post from "../components/Post";
import { useRecoilState } from "recoil";
import postsAtom from "../atoms/postsAtom";
import CreatePost from "../components/CreatePost";
import { useTranslation } from "react-i18next";
const HomePage = () => {
  const [posts, setPosts] = useRecoilState(postsAtom);
  const [isLoading, setIsLoading] = useState(true);
  const showToast = useShowToast();
  const { t } = useTranslation();
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

      {!isLoading && posts?.length === 0 &&  <div className="home-page"> <h1>{t('followUsers')}</h1></div>}

      {posts?.length > 0 &&
        posts?.map((post) => {
          return <Post key={post._id} post={post}></Post>;
        })}
    </>
  );
};

export default HomePage;
