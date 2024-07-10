import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useShowToast from "../hooks/useShowToast";
import { useRecoilState } from "recoil";
import postsAtom from "../atoms/postsAtom";
import Post from "./Post";
import { Flex, Spinner } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";

const UserThreads = () => {
  const [fetchingPost, setFetchingPost] = useState(true);
  const { username } = useParams();
  const showToast = useShowToast();
  const [posts, setPosts] = useRecoilState(postsAtom);
  const {t} = useTranslation();
  useEffect(() => {
    const getPosts = async () => {
      setFetchingPost(true);
      try {
        const res = await fetch(`/api/posts/user/${username}`);
        const data = await res.json();
        if (data.error) {
          showToast("Error", data.error, "error");
        }
        document.title = "Profile";
        setPosts(data);
      } catch (error) {
        showToast("Error", error.message, "error");
      } finally {
        setFetchingPost(false);
      }
    };

    getPosts();
  }, [username, showToast, setPosts]);

  if (fetchingPost) {
    return (
      <Flex justifyContent={"center"} my={12}>
        <Spinner size={"xl"} />
      </Flex>
    );
  }

  if (!fetchingPost && posts.length === 0) {
    return (
      <div className="user-message">
        <h1>{t("noPost")}</h1>
      </div>
    );
  }

  return <>{posts?.length > 0 && posts?.map((post) => <Post key={post._id} post={post} />)}</>;
};

export default UserThreads;
