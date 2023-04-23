import { Box, Text, Card, CardHeader, CardFooter, Button, Icon, useColorMode, useDisclosure, ModalBody, Modal, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Spinner } from '@chakra-ui/react';
import type { ActionArgs } from '@remix-run/node';
import { Form } from '@remix-run/react';
import { redirect } from 'react-router';
import Header from '~/components/Header';
import { BsGithub, BsMoonFill, BsQuestionCircle } from 'react-icons/bs';
import styles from '../utils/fonts.css';
import { useNavigation } from "@remix-run/react";

export async function action({ request }: ActionArgs) {
  const formData = await request.formData();
  const intent = formData.get('intent');
  if(intent === 'guest'){
    return redirect(`/game/`);
  }else if(intent === 'signup'){
    return redirect('/signup');
  }else if(intent === 'login'){
    return redirect('/login');
  }    
}

export const links = () => {
  return [{ rel: "stylesheet", href: styles }];
};

export default function Index() {
  const {colorMode, toggleColorMode} = useColorMode()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const navigation = useNavigation();
  

  return (
    <>
      <Header 
        title='Albumdle' 
        leftIcon={<a href='https://github.com/JacobBartlett24'><Icon _hover={{boxShadow: "white"}} borderRadius={"50%"} as={BsGithub} boxSize={6} /></a>}
        rightIcon={<Icon _hover={{boxShadow: "white"}} borderRadius={"50%"} boxSize={6} as={BsQuestionCircle} onClick={onOpen}/>}/>
        <Modal isOpen={isOpen} onClose={onClose} size={"xl"} scrollBehavior={"inside"}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontSize={"3xl"}>FAQ</ModalHeader>
          <ModalCloseButton />
          <ModalBody p={"10px"}>
            <Text fontSize={"2xl"} fontWeight="bold">How do I play?</Text>
            <Text fontWeight={"medium"}>Albumdle is a game where you try to guess the album name based on hints given.
             You get 6 tries to get the correct album. The first guess is with no hints other than the obfuscated album name,
              after that you will be given a hint per guess.<br/></Text>
            <Text fontSize={"2xl"} fontWeight="bold">Is this the whole game?</Text>
            <Text fontWeight={"medium"}>It depends! If it gains some traction I plan on adding some extra features such as different
            genres, endless mode, and stuff of that nature.<br/></Text>
            <Text fontSize={"2xl"} fontWeight="bold">Contact me</Text>
            <Text fontWeight={"medium"}>If there's any bugs or you just want to connect, send me an email at <Text fontWeight="bold">albumdleapp@gmail.com</Text><br/></Text>
          </ModalBody>
        </ModalContent>
      </Modal>
      <Box h={"calc(100vh - 60px)"} fontFamily={"Inter"} display={"flex"} flexDir={"column"} justifyContent={"center"} alignItems={"center"}>
        <Card boxShadow={"white"}w={"300px"} h={"20rem"} align={"center"} justifyContent={"space-evenly"} bg={"brandwhite.900"}>
          <CardHeader>
            <Text color={"black"} fontSize={"2rem"}>Welcome!</Text>
          </CardHeader>
          <CardFooter>
            <Form method="post">
                <Box display={"flex"} flexDir={"column"} justifyContent={"center"} alignItems={"center"}>
                  {/* <Box>
                    <Button color={"black"} colorScheme={"blackAlpha"} name={"intent"} value={"signup"} type={"submit"} mr={".3rem"}>Signup</Button>
                    <Button color={"black"} colorScheme={"blackAlpha"} name={"intent"} value={"login"} type={"submit"} ml={".3rem"}>Login</Button>
                  </Box> */}
                  <Box>
                    <Button color={"black"} colorScheme={"blackAlpha"} name={"intent"} value={"guest"} type={"submit"} mt={"1rem"}>{navigation.state == "idle" ? "Continue As Guest" : <Spinner />}
                    </Button>
                  </Box>
                </Box>
            </Form>
          </CardFooter>
        </Card>
      </Box>
    </>
  );
}
