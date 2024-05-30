import {
  Box,
  Flex,
  FormControl,
  Image,
  Input,
  Spinner,
  Text,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import useShowToast from "../hooks/useShowToast";
import Post from "./Post";
import { SearchIcon, SmallCloseIcon } from "@chakra-ui/icons";
import qs from "qs";
import UserCard from "./UserCard";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";

const SearchBar = () => {
  const [searchResults, setSearchResults] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchVal, setSearchVal] = useState("");
  const showToast = useShowToast();
  const SEARCH_DELAY = 1000; // Will search after ... ms when user stop typing
  const isDarkMode = localStorage.getItem("chakra-ui-color-mode") === "dark";
  const [user, setUser] = useState(useRecoilValue(userAtom));

  const validate = (val) => {
    setSearchVal(val);
  };

  const isFollowing = (targetUserId) => {
    return user.following.includes(targetUserId);
  };

  const getEncodedQueryString = (val) => {
    const regex = /([^a-zA-Z\d])/g;
    val = val.replace(regex, "\\$1");

    return qs.stringify({ filter: val });
  };

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch(`/api/users/${user._id}`);
        const data = await res.json();

        setUser(data);
      } catch (err) {
        showToast("Error", "Invalid user", "error");
        console.error(err);
      }
    }

    fetchUser();
    console.count("fetchUser");
  }, []);

  useEffect(() => {
    console.count("searchVal");
    if (!searchVal || searchVal === "") {
      setSearchResults(null);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);

    const search = setTimeout(async () => {
      try {
        const data = {};
        const postRes = await fetch(
          "/api/posts/search?" + getEncodedQueryString(searchVal),
        );

        if (postRes.status === 200) {
          data.posts = await postRes.json();
        }

        const userRes = await fetch(
          "/api/users/search?" + getEncodedQueryString(searchVal),
        );

        if (userRes.status === 200) {
          data.users = await userRes.json();
        }

        setSearchResults(data);
      } catch (err) {
        showToast("Error", "Error while finding post", "error");
        console.error(err);
      }
    }, SEARCH_DELAY);

    return () => clearTimeout(search);
  }, [searchVal]);

  const clearSearchInput = () => {
    setSearchResults(null);
    setIsSearching(false);
    setSearchVal("");
  };

  const resultList = () => {
    const { users, posts } = searchResults;

    if (users && users.length === 0 && posts && posts.length === 0) {
      return (
        <Flex
          justifyContent="center"
          alignItems="end"
          h="60vh"
          position="relative"
        >
          <Image
            src="/chat-bubble.svg"
            w="30%"
            position="absolute"
            top="10"
            left="22%"
            filter={isDarkMode ? "invert(1)" : "none"}
          />
          <Text position="absolute" top="90" left="27%" w="23%">
            There is nothing to show
          </Text>
          <Image src="/anime-girl-shoulder-shrug.png" w="50%" />
        </Flex>
      );
    }

    const arr = [];
    console.log("Search result: ");
    console.log(searchResults);

    if (users) {
      users.map((user) => {
        arr.push(
          <UserCard
            key={user._id}
            id={user._id}
            name={user.name}
            username={user.username}
            profileImgUrl={user.profilePic}
            isFollowing={isFollowing(user._id)}
          />
        );
      });
    }

    if (posts) {
      posts.map((item) =>
        arr.push(
          <Post key={item._id} post={item} postedBy={item.postedBy}></Post>,
        ),
      );
    }

    return arr;
  };

  return (
    <Box rounded={8} p={2}>
      <FormControl mb="32px">
        <Input
          type="text"
          value={searchVal}
          onChange={(e) => validate(e.target.value)}
          ps="50px"
          height="50px"
          placeholder="Search"
          borderWidth="2px"
          borderColor={isDarkMode ? "gray.700" : "gray.300"}
        />
        <SearchIcon
          pos="absolute"
          top="3.5"
          left="5"
          zIndex="999"
          boxSize="5"
          opacity="0.7"
        />

        {searchVal && (
          <SmallCloseIcon
            pos="absolute"
            top="3.5"
            right="5"
            zIndex="999"
            boxSize="5"
            bgColor={isDarkMode ? "gray.700" : "gray.300"}
            opacity="0.7"
            rounded="50%"
            cursor="pointer"
            onClick={() => clearSearchInput()}
          />
        )}
      </FormControl>

      {isSearching && !searchResults && (
        <Flex justifyContent="center" alignItems="center">
          <Spinner />
        </Flex>
      )}
      {searchResults && resultList()}
    </Box>
  );
};

export default SearchBar;
