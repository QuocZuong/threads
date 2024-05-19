import {
  Box,
  Flex,
  FormControl,
  Image,
  Input,
  Spinner,
  UnorderedList,
  Text,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import useShowToast from "../hooks/useShowToast";
import Post from "./Post";
import { SearchIcon, SmallCloseIcon } from "@chakra-ui/icons";

const SearchBar = () => {
  const [searchResults, setSearchResults] = useState(undefined);
  const [isSearching, setIsSearching] = useState(false);
  const [searchVal, setSearchVal] = useState("");
  const showToast = useShowToast();
  const SEACRH_DELAY = 1000; // Will search after ... ms when user stop typing
  const isDarkMode = localStorage.getItem("chakra-ui-color-mode") === "dark";

  const validate = (val) => {
    const regex = /^[a-zA-Z0-9]*$/;

    if (!regex.test(val)) return;

    setSearchVal(val);
  };

  useEffect(() => {
    if (!searchVal || searchVal === "") {
      setSearchResults(null);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);

    const search = setTimeout(async () => {
      try {
        const res = await fetch("/api/posts/search?text=" + searchVal);
        const data = await res.json();

        if (data) {
          setSearchResults(data);
        }
      } catch (err) {
        showToast("Error", "Error while find post", "error");
        console.error(err);
      }
    }, SEACRH_DELAY);

    return () => clearTimeout(search);
  }, [searchVal]);

  const resultList = () => {
    if (searchResults.length === 0) {
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

    searchResults.map((item) =>
      arr.push(
        <Post key={item._id} post={item} postedBy={item.postedBy}></Post>,
      ),
    );

    return <UnorderedList>{arr}</UnorderedList>;
  };

  const clearSearchInput = () => {
    setSearchResults(null);
    setIsSearching(false);
    setSearchVal("");
  };

  return (
    <>
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

          {isSearching && (
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

        {!searchResults && isSearching && (
          <Flex justifyContent="center" alignItems="center">
            <Spinner />
          </Flex>
        )}
        {searchResults && resultList()}
      </Box>
    </>
  );
};

export default SearchBar;
