import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import { db } from "~/utils/db.server";
import type { TopAlbumsGeneral} from "@prisma/client";
import { Box, Card, CardHeader, Heading, Text } from "@chakra-ui/react";

type Album = {
  name: string;
  type: string;
  total_tracks: number;
  release_date: string;
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


export async function loader({params}: LoaderArgs){
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
  let randomAlbum: TopAlbumsGeneral = useLoaderData()

  function obfuscate(albumName: string){
    let obfuscatedAlbumName: string = "";
    for(let i = 0; i < albumName.length; i++){
      if(albumName[i] === " "){
        obfuscatedAlbumName += "";
      } else {
        obfuscatedAlbumName += " __";
      }
    }
    return obfuscatedAlbumName;
  }

  return(
    <Box>
      <Heading>Guess The Album Daily</Heading>
      <Card>
        <CardHeader>
          <Text>{obfuscate(randomAlbum.name!)}</Text>
          <Text>{randomAlbum.name!}</Text>     
        </CardHeader>
      </Card>
    </Box>
  )
}