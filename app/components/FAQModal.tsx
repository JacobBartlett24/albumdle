import { Modal, ModalOverlay, ModalContent, ModalHeader, Text, ModalCloseButton, ModalBody, useDisclosure } from "@chakra-ui/react";

export default function FAQModal() {
  const { isOpen, onOpen, onClose } = useDisclosure()

  return(
    <>
      <Modal isOpen={isOpen} onClose={onClose} size={"xl"} scrollBehavior={"inside"}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>FAQ</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>How do I play?</Text>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}