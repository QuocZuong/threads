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
  const observer = useRef();

  useEffect(() => {
    setPage(1);
    setPosts([]);
    getFeedPosts(1);
  }, []);

  useEffect(() => {
    if (page >= 2) getFeedPosts(page);
    console.log("page", page);
  }, [page]);

  const getFeedPosts = async (page) => {
    setIsLoading(true);
    setPosts([]);
    try {
      const res = await fetch(`/api/posts/feed?page=${page}&limit=2`);
      const data = await res.json();

      if (res.status === 500) {
        showToast("Error", data.message, "error");
        return;
      }

      if (data.error) {
        showToast("Error", data.error, "error");
        return;
      }

      console.log(data);

      if (data.length === 0) {
        setHasMore(false);
      } else {
        setPosts((prevPosts) => {
          return Set([...prevPosts, ...data]);
        });
        setHasMore(data.length > 0);
      }
    } catch (error) {
      showToast("Error", "Error while loading feed", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const lastPostElementRef = useCallback(
    (node) => {
      console.log(node);
      if (isLoading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1);
        }
      });
      if (node) observer.current.observe(node);
      console.log("a");
    },
    [isLoading, hasMore],
  );

  return (
    <>
      {isLoading && (
        <Flex justifyContent={"center"}>
          <Spinner size={"xl"} />
        </Flex>
      )}
      <CreatePost />

      {!isLoading && posts?.length === 0 &&  <div className="home-page"> <h1>{t('followUsers')}</h1></div>}

      {posts?.map((post, index) => {
        if (posts.length === index + 1) {
          return (
            <Post
              key={post._id}
              post={post}
              postedBy={post.postedBy}
              setPosts={setPosts}
              refs={lastPostElementRef}
              isLastPost={true}
            />
          );
        } else {
          return <Post key={post._id} post={post} isLastPost={false} />;
        }
      })}
      {isLoading && (
        <Flex justifyContent={"center"} pt={10}>
          <Spinner />
        </Flex>
      )}
      {!hasMore && <h1>No more posts</h1>}
    </>
  );
};

export default HomePage;
