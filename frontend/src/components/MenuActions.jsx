import { Flex, Menu, MenuButton, MenuDivider, MenuItem, MenuList, Text, useColorModeValue } from "@chakra-ui/react";
import { HiDotsHorizontal } from "react-icons/hi";
import { LuLink2 } from "react-icons/lu";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import { AiOutlineDelete } from "react-icons/ai";
import { FiEdit } from "react-icons/fi";
import PropTypes from "prop-types";
import ModalEditPost from "./ModalEditPost";
import React, { useState, useEffect } from "react";

export const MenuActions = ({ poster, onCopyLink, onDelete, onUpdate, post }) => {
  console.log("ádas ", poster);
  const currentUser = useRecoilValue(userAtom);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const menuBg = useColorModeValue("white", "#181818");
  const menuTextColor = useColorModeValue("black", "white");
  const menuItemBgHover = useColorModeValue("gray.100", "#212121");

  const handleOpenEditModal = () => {
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
  };

  const handleUpdatePost = (updatedText) => {
    // Implement your update post logic here
    console.log("Updating post with new text:", updatedText);
  };

  return (
    <>
      <Menu direction="rlt" placement="bottom-end">
        <MenuButton justifyContent={"flex-end"} p={0} borderRadius="md" h={"20px"} _hover={"none"}>
          <HiDotsHorizontal />
        </MenuButton>
        <MenuList boxShadow={"unset"} bg={menuBg} color={menuTextColor}>
          {currentUser?._id === poster._id && onUpdate && (
            <>
              <MenuItem
                w={"90%"}
                ml={3}
                bg={"menuBg"}
                borderRadius={10}
                _hover={{ bg: menuItemBgHover }}
                onClick={handleOpenEditModal}
                cursor={"pointer"}
                command={<FiEdit size={22} />}
              >
                Edit
              </MenuItem>
              <MenuDivider />
            </>
          )}
          {onCopyLink && (
            <MenuItem
              w={"90%"}
              ml={3}
              bg={"menuBg"}
              borderRadius={10}
              _hover={{ bg: menuItemBgHover }}
              command={<LuLink2 style={{ transform: "rotate(-45deg)" }} size={22} />}
              onClick={onCopyLink}
            >
              Copy link
            </MenuItem>
          )}
          {currentUser?._id === poster._id && onDelete && (
            <>
              <MenuDivider />
              <MenuItem
                w={"90%"}
                ml={3}
                bg={"menuBg"}
                borderRadius={10}
                _hover={{ bg: menuItemBgHover }}
                onClick={onDelete}
                cursor={"pointer"}
                color={"rgb(255, 48, 64)"}
                command={<AiOutlineDelete color="red.500" size={22} />}
              >
                Delete
              </MenuItem>
            </>
          )}
        </MenuList>
      </Menu>

      <ModalEditPost
        poster={poster}
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        onUpdatePost={handleUpdatePost}
        post={post}
      />
    </>
  );
};

MenuActions.propTypes = {
  poster: PropTypes.object.isRequired,
  onCopyLink: PropTypes.func,
  onDelete: PropTypes.func,
  onUpdate: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]),
};

export default MenuActions;
