import { json } from "@remix-run/node";
import type {ActionArgs, LoaderArgs} from "@remix-run/node";
import { useActionData, useFetcher, useLoaderData } from "@remix-run/react";
import { db } from "~/utils/db.server";
import type { TopAlbumsGeneral} from "@prisma/client";
import { Box, Button, Card, CardBody, CardFooter, CardHeader, Heading, Input, StackDivider, Text, VStack } from "@chakra-ui/react";
import { useState } from "react";

async function loadRandomAlbum(){
  let newSearchResults: Array<TopAlbumsGeneral> = await db.topAlbumsGeneral.findMany({
    take: 500,
  });

  const randomVinyl: TopAlbumsGeneral = newSearchResults [Math.floor(Math.random() * newSearchResults.length)];
  
  return randomVinyl;
}


export async function loader({request}: LoaderArgs){
  let album: TopAlbumsGeneral = await loadRandomAlbum();
  const url = new URL(request.url);
  const guessValue = url.searchParams.getAll("guessValue");
  const guessNumber = url.searchParams.getAll("guessNumber");
  return json({album: album, guessValue: guessValue, guessNumber: guessNumber});
}

export async function action({request}: ActionArgs){
  return(
    json({message: "guess", correct: true})
  )
}

export default function GameRoute() {
  let data = useLoaderData()
  let randomAlbum: TopAlbumsGeneral = data.album;
  let guessData: string = data.guessValue;

  const fetcher = useFetcher();
  console.log(data)
  const [guess, setGuess] = useState(0);

  function obfuscate(albumName: string){
    let obfuscatedAlbumName: string = "";
    const regex = /\([^)]*\)/g;
    albumName = albumName.replace(regex, "");
    for(let i = 0; i < albumName.length; i++){
      if(albumName[i] === " "){
        obfuscatedAlbumName += "\xa0\xa0";
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
          <Text>Title:</Text>
          <Text>{obfuscate(randomAlbum.name!)}</Text>
        </CardHeader>
        <CardBody>
        <VStack
          divider={<StackDivider borderColor='gray.200' />}
          spacing={4}
          align='stretch'
        >
          <Box h='40px'>
            First Track: {randomAlbum.tracks[0]}
          </Box>
          <Box h='40px'>
            Release Date: {randomAlbum.release_date}
          </Box>
          <Box h='40px'>
            Second Track: {randomAlbum.tracks[1]}
          </Box>
          <Box h='40px'>
            Recent Popularity (0-100): {randomAlbum.popularity}
          </Box>
          <Box h='40px'>
            Artist: {randomAlbum.artists[0].name}
          </Box>
        </VStack>
        </CardBody>
        <CardFooter>
          <fetcher.Form method="get">
            <input type="hidden" name="guessNumber" value="0" />
            <Box display={"flex"} flexDir={"row"}>
              <Input type="search" name="guessValue"/>
              <Button type="submit">Guess</Button>
            </Box>
          </fetcher.Form>
        </CardFooter>
      </Card>
    </Box>
  )
}