import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import UserHeader from "../components/UserHeader";
import useShowToast from "../hooks/useShowToast.js";
import { Spinner, Flex } from "@chakra-ui/react";
import Post from "../components/Post.jsx";
import useGetUserProfile from "../hooks/useGetUserProfile.js";
import postsAtom from "../atoms/postsAtom.js";
import { useRecoilState } from "recoil";
import { useTranslation } from "react-i18next";
const UserPage = () => {
  const { isLoading, user } = useGetUserProfile();
  const { username } = useParams();
  const showToast = useShowToast();
  const [posts, setPosts] = useRecoilState(postsAtom);
  const [fetchingPost, setFetchingPost] = useState(true);
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

  if (!user && isLoading) {
    return (
      <Flex justifyContent={"center"}>
        <Spinner size={"xl"} />
      </Flex>
    );
  }

  if (!user && !isLoading) return <h1>{t('notFound')}</h1>;

  return (
    <>
      <UserHeader user={user} />
      {!fetchingPost && posts.length === 0 && (
        <div className="user-message">
          <h1>{t('noPost')}</h1>
        </div>
      )}

      {/* {fetchingPost && (
                <Flex justifyContent={"center"} my={12}>
                    <Spinner size={"xl"} />
                </Flex>
            )} */}

      {posts?.length > 0 && posts?.map((post) => <Post key={post._id} post={post} />)}
    </>
  );
};

export default UserPage;
