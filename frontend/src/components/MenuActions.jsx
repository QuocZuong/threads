import { Menu, MenuButton, MenuDivider, MenuItem, MenuList, useColorModeValue } from "@chakra-ui/react";
import { HiDotsHorizontal } from "react-icons/hi";
import { LuLink2 } from "react-icons/lu";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import { AiOutlineDelete } from "react-icons/ai";
import { FiEdit } from "react-icons/fi";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

export const MenuActions = ({ poster, onCopyLink, onDelete, onUpdate, onOpenUpdateModal }) => {
  const currentUser = useRecoilValue(userAtom);

  const menuBg = useColorModeValue("white", "#181818");
  const menuTextColor = useColorModeValue("black", "white");
  const menuItemBgHover = useColorModeValue("gray.100", "#212121");
  const {t} = useTranslation();
  return (
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
              onClick={onOpenUpdateModal}
              cursor={"pointer"}
              command={<FiEdit size={22} />}
            >
              {t("edit")}
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
            {t("copyLink")}
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
              {t("delete")}
            </MenuItem>
          </>
        )}
      </MenuList>
    </Menu>
  );
};

MenuActions.propTypes = {
  poster: PropTypes.object.isRequired,
  onCopyLink: PropTypes.func,
  onDelete: PropTypes.func,
  onUpdate: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]),
  onOpenUpdateModal: PropTypes.func,
};

export default MenuActions;
