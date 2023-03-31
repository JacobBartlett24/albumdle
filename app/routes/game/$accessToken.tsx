import { Box, Button, Card, CardBody, CardFooter, CardHeader, Divider, Input, Stack, Text } from "@chakra-ui/react";
import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import { db } from "~/utils/db.server";
import type { TopAlbumsGeneral } from "@prisma/client";

type Album = {
  name: string;
  type: string;
  total_tracks: number;
  release_date: string;
  release_date_precision: string;
  genres: Array<string>;
  artists: Array<Artist>;
  popularity: number;
}

type Artist ={
  name: string;
}

async function loadRandomAlbum(){
  let newSearchResults: Array<TopAlbumsGeneral> = await db.topAlbumsGeneral.findMany({
    take: 500,
  });

  const randomVinyl: TopAlbumsGeneral = newSearchResults [Math.floor(Math.random() * newSearchResults.length)];
  
  return randomVinyl;
}

export async function loader({params}: LoaderArgs): Promise<TopAlbumsGeneral>{
  let album: TopAlbumsGeneral = await loadRandomAlbum();

  return album;
}

export async function action({request}: ActionArgs){
  let formData = await request.formData();
  let guess: number = formData.get("guessNumber");
  guess = guess + 1;
  return {
    json: { guess }
  }
}

export default function GameRoute() {
  //let album: Album = useLoaderData();
  let randomAlbum: TopAlbumsGeneral = useLoaderData()

  return(
    // <Card w={"500px"} h={"600px"}>
    //   <CardHeader>
    //   </CardHeader>
    //   <CardBody>
    //     <Stack spacing={3}>
    //       <Text>1</Text>
    //     </Stack>
    //     <Divider />
    //     <Stack spacing={3}>
    //       <Text>2</Text>
    //     </Stack>
    //     <Divider />
    //     <Stack>
    //       <Text>3</Text>
    //     </Stack>
    //     <Divider />
    //     <Stack>
    //       <Text>4</Text>
    //     </Stack>
    //     <Divider />
    //     <Stack>
    //       <Text>5</Text>
    //     </Stack>
    //     <Divider />
    //   </CardBody>
    //   <CardFooter>
    //     <Form>
    //       <Input />
    //       <Button type="submit"></Button>
    //     </Form>
    //   </CardFooter>
    // </Card>
    <div>
      <h1>{randomAlbum.name}</h1>
    </div>
  )
}