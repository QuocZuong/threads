import {
  Box,
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

/**
 * The modal for deleting a post.
 *
 * @param {Function} isOpen Whether the modal is open.
 * @param {Function} onClose Function to close the modal.
 * @param {Function} onDelete Function to delete the post.
 * @param {Boolean} isLoading Whether the post is being deleted.
 *
 * @returns The JSX for the delete modal.
 */
export const DeleteModal = ({ isOpen, onClose, onDelete, isLoading }) => {
  const menuBg = useColorModeValue("white", "#181818");

  return (
    <Modal isOpen={isOpen} onClose={onClose} size={"xs"} isCentered>
      <ModalOverlay />
      <ModalContent bg={menuBg} borderRadius={20}>
        <ModalHeader fontWeight={"bold"} textAlign={"center"}>
          Delete post?
        </ModalHeader>
        <ModalBody textAlign={"center"} color={"gray"}>
          {`If you delete this post, you won't be able to restore it.`}
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
                Cancel
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
                Delete
              </Button>
            </HStack>
          </VStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default DeleteModal;
