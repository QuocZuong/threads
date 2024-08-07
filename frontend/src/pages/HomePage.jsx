import { Flex, Spinner } from "@chakra-ui/react";
import { useState, useEffect, useRef, useCallback } from "react";
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
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    const getFeedPosts = async (page) => {
      setIsLoading(true);

      try {
        const res = await fetch(`/api/posts/feed?page=${page}&limit=6`);
        const data = await res.json();

        if (res.status === 500) {
          showToast("Error", data.message, "error");
          return;
        }

        if (data.error) {
          showToast("Error", data.error, "error");
          return;
        }

        if (data.length === 0) {
          setHasMore(false);
        } else {
          setPosts((prevPosts) => {
            const newPosts = data.filter((post) => !prevPosts.find((p) => p._id === post._id));
            return [...prevPosts, ...newPosts];
          });
          setHasMore(data.length > 0);
        }
      } catch (error) {
        showToast("Error", "Error while loading feed", "error");
      } finally {
        setIsLoading(false);
      }
    };

    if (page) getFeedPosts(page);
  }, [page, setPosts, showToast]);

  const observer = useRef();
  const lastPostElementRef = useCallback(
    (node) => {
      if (isLoading) return;
      if (observer.current) {
        observer.current.disconnect();
      }
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [isLoading, hasMore],
  );

  return (
    <>
      <CreatePost />

      {!isLoading && posts?.length === 0 && (
        <div className="home-page">
          <h1>{t("followUsers")}</h1>
        </div>
      )}

      {posts?.map((post, index) => {
        if (posts.length === index + 1) {
          return (
            <Post
              key={post._id}
              post={post}
              postedBy={post.postedBy}
              setPosts={setPosts}
              lastPostRef={lastPostElementRef}
              isLastPost={true}
            />
          );
        } else {
          return <Post key={post._id} post={post} isLastPost={false} />;
        }
      })}
      <Flex h={posts.length === 0 ? "300px" : "30px"} justifyContent={"center"} alignItems={"center"}>
        {isLoading && <Spinner />}
      </Flex>
    </>
  );
};

export default HomePage;
