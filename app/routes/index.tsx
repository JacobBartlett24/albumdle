import { Box, Text, Card, CardHeader, CardFooter, Button, Icon, useColorMode } from '@chakra-ui/react';
import type { ActionArgs } from '@remix-run/node';
import { Form } from '@remix-run/react';
import { redirect } from 'react-router';
import Header from '~/components/Header';
import { BsMoonStarsFill } from 'react-icons/bs';


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

export default function Index() {
  const {colorMode, toggleColorMode} = useColorMode()

  return (
    <Box display={"flex"} flexDir={"column"} alignItems={"center"}>
      <Header title='Albumdle' leftIcon={<Icon as={BsMoonStarsFill} boxSize={6} onClick={() => toggleColorMode()}/>} rightIcon={<Icon boxSize={6} as={BsMoonStarsFill}/>}/>
      <Card w={"300px"} marginTop={"15rem"} h={"20rem"} align={"center"} justifyContent={"space-evenly"} bg={"brandwhite.900"}>
        <CardHeader>
          <Text color={"black"} fontSize={"2rem"}>Welcome!</Text>
        </CardHeader>
        <CardFooter>
          <Form method="post">
              <Box display={"flex"} flexDir={"column"} justifyContent={"center"} alignItems={"center"}>
                <Box>
                  <Button color={"black"} bg={"brandgreen.900"}name={"intent"} value={"signup"} type={"submit"} mr={".3rem"}>Signup</Button>
                  <Button color={"black"} bg={"brandgreen.900"}name={"intent"} value={"login"} type={"submit"} ml={".3rem"}>Login</Button>
                </Box>
                <Box>
                  <Button color={"black"} bg={"brandgreen.900"} name={"intent"} value={"guest"} type={"submit"} mt={"1rem"}>Continue As Guest</Button>
                </Box>
              </Box>
          </Form>
        </CardFooter>
      </Card>
    </Box>
  );
}
