import {
  Button,
  Divider,
  HStack,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  StackDivider,
  VStack,
  useColorModeValue,
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import { DELETE_MODAL_TYPES } from "../constants/deleteModal.constants";

/**
 * The modal for deleting an item.
 *
 * @param {Boolean} isOpen Whether the modal is open.
 * @param {Function} onClose The function to close the modal.
 * @param {Function} onDelete The function to delete the item.
 * @param {Boolean} isLoading Whether the delete operation is in progress.
 * @param {String} type The type of the item to delete, as defined in {@link DELETE_MODAL_TYPES}.
 *
 * @returns The JSX for the delete modal.
 */
export const DeleteModal = ({ isOpen, onClose, onDelete, isLoading, type }) => {
  const menuBg = useColorModeValue("white", "#181818");
  const { t } = useTranslation("deleteModal", { keyPrefix: type === DELETE_MODAL_TYPES.post ? "post" : "comment" });
  const { t: tc } = useTranslation("deleteModal", { keyPrefix: "common" });

  return (
    <Modal isOpen={isOpen} onClose={onClose} size={"xs"} isCentered>
      <ModalOverlay />
      <ModalContent bg={menuBg} borderRadius={20}>
        <ModalHeader fontWeight={"bold"} textAlign={"center"}>
          {t("header")}
        </ModalHeader>
        <ModalBody textAlign={"center"} color={"gray"}>
          {t("body")}
        </ModalBody>
        <ModalFooter justifyContent={"space-between"}>
          <VStack w={"full"}>
            <Divider />
            <HStack w={"full"} divider={<StackDivider />}>
              <Button
                w={"full"}
                h={"40px"}
                bg={"transparent"}
                onClick={onClose}
                textAlign={"center"}
                alignContent={"center"}
              >
                {tc("cancel")}
              </Button>
              <Button
                w={"full"}
                h={"40px"}
                bg={"transparent"}
                color={"red.500"}
                fontWeight={"bold"}
                textAlign={"center"}
                alignContent={"center"}
                onClick={onDelete}
                isLoading={isLoading}
              >
                {tc("delete")}
              </Button>
            </HStack>
          </VStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

DeleteModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
  type: PropTypes.string.isRequired,
};

export default DeleteModal;
