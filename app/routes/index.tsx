import { Box, Text, Card, CardHeader, CardFooter, Button, Icon, useColorMode, useDisclosure, ModalBody, Modal, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay } from '@chakra-ui/react';
import type { ActionArgs } from '@remix-run/node';
import { Form } from '@remix-run/react';
import { redirect } from 'react-router';
import Header from '~/components/Header';
import { BsMoonFill, BsQuestionCircle } from 'react-icons/bs';
import styles from '../utils/fonts.css';
import FAQModal from '~/components/FAQModal';

export async function action({ request }: ActionArgs) {
  const formData = await request.formData();
  const intent = formData.get('intent');
  if(intent === 'guest'){
    var authOptions = {
      url: 'https://accounts.spotify.com/api/token?grant_type=client_credentials',
      headers: {
        'Authorization': 'Basic ' + (new Buffer.from(process.env.SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_CLIENT_SECRET).toString('base64')),
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      form:{
        'grant_type': 'client_credentials'
      },
      json: true
    };

    var response = await fetch(authOptions.url, {
      method: 'POST',
      headers: authOptions.headers,
    }).then(res => res.json());

    return redirect(`/game/${response.access_token}`);
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
  

  return (
    <>
      <Header 
        title='Albumdle' 
        leftIcon={<Icon _hover={{boxShadow: "white"}} borderRadius={"50%"} as={BsMoonFill} boxSize={6} onClick={() => toggleColorMode()}/>}
        rightIcon={<Icon _hover={{boxShadow: "white"}} borderRadius={"50%"} boxSize={6} as={BsQuestionCircle} onClick={onOpen}/>}/>
        <Modal isOpen={isOpen} onClose={onClose} size={"xl"} scrollBehavior={"inside"}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontSize={"3xl"}>FAQ</ModalHeader>
          <ModalCloseButton />
          <ModalBody p={"10px"}>
            <Text fontSize={"2xl"} fontWeight="bold">How do I play?</Text>
            <Text>Albumdle is a game where you try to guess the album name based on hints given.</Text>
            <Text fontSize={"2xl"} fontWeight="bold">Why create an account?</Text>
            <Text>Creating an account lets you keep track of your streak!</Text>
          </ModalBody>
        </ModalContent>
      </Modal>
      <Box h={"100vh"} fontFamily={"Inter"} display={"flex"} flexDir={"column"} justifyContent={"center"} alignItems={"center"}>
        <Card boxShadow={"white"}w={"300px"} h={"20rem"} align={"center"} justifyContent={"space-evenly"} bg={"brandwhite.900"}>
          <CardHeader>
            <Text color={"black"} fontSize={"2rem"}>Welcome!</Text>
          </CardHeader>
          <CardFooter>
            <Form method="post">
                <Box display={"flex"} flexDir={"column"} justifyContent={"center"} alignItems={"center"}>
                  <Box>
                    <Button color={"black"} colorScheme={"blackAlpha"} name={"intent"} value={"signup"} type={"submit"} mr={".3rem"}>Signup</Button>
                    <Button color={"black"} colorScheme={"blackAlpha"} name={"intent"} value={"login"} type={"submit"} ml={".3rem"}>Login</Button>
                  </Box>
                  <Box>
                    <Button color={"black"} colorScheme={"blackAlpha"} name={"intent"} value={"guest"} type={"submit"} mt={"1rem"}>Continue As Guest</Button>
                  </Box>
                </Box>
            </Form>
          </CardFooter>
        </Card>
      </Box>
    </>
  );
}
