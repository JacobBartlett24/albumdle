import { Box, Text, Card, CardHeader, CardBody, CardFooter, Button, Heading } from '@chakra-ui/react';
import type { ActionArgs } from '@remix-run/node';
import { Form, Link } from '@remix-run/react';
import { redirect } from 'react-router';
import Header from '~/components/Header';
import { getSession, commitSession } from "../session";

export async function action({ request }: ActionArgs) {
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
}

export default function Index() {
  return (
    
    <Box display={"flex"} flexDir={"column"} alignItems={"center"}>
      <Header />
      <Card w={"300px"} marginTop={"20rem"} h={"20rem"} align={"center"} justifyContent={"space-evenly"}>
        <CardHeader>
          <Text fontSize={"2rem"}>Login</Text>
        </CardHeader>
        <CardFooter>
          <Form method="post">
              <Box display={"flex"} flexDir={"column"} justifyContent={"center"} alignItems={"center"}>
                <Box>
                  <Button mr={".3rem"}>Signup</Button>
                  <Button ml={".3rem"}>Login</Button>
                </Box>
                <Box>
                  <Button type={"submit"} mt={"1rem"}>Continue As Guest</Button>
                </Box>
              </Box>
          </Form>
        </CardFooter>
      </Card>
    </Box>
  );
}
