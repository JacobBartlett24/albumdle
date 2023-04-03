import { json } from "@remix-run/node";
import type {ActionArgs, LoaderArgs} from "@remix-run/node";
import { useFetcher, useLoaderData } from "@remix-run/react";
import { db } from "~/utils/db.server";
import type { TopAlbumsGeneral} from "@prisma/client";
import { Box, Button, Card, CardBody, CardFooter, CardHeader, Heading, Input, List, ListItem, StackDivider, Text, VStack } from "@chakra-ui/react";
import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import SearchRecommendationDropdown from "~/components/SearchRecommendationDropdown";

async function loadRandomAlbum(){
  let newSearchResults: Array<TopAlbumsGeneral> = await db.topAlbumsGeneral.findMany({
    take: 500,
  });

  const randomVinyl: TopAlbumsGeneral = newSearchResults [Math.floor(Math.random() * newSearchResults.length)];
  
  return randomVinyl;
}

async function getAlbumName(randomAlbumId: number){
  const album = await db.topAlbumsGeneral.findUnique({
    where: {
      id: randomAlbumId,
    },
  });
  return album!.name;
}

export async function loader({request}: LoaderArgs){
  let album: TopAlbumsGeneral = await loadRandomAlbum();
  const url = new URL(request.url);
  const guessValue: string = url.searchParams.get("guessValue")!;
  const albumId: number = +url.searchParams.get("albumId")!;
  if(albumId){
    const albumName = await getAlbumName(albumId); 
  }
  return json({result: false, album: album, guessValue: guessValue});
}



export function createSupaBaseConnection() {
  return createClient(
    "https://svbajrscixbgfocqqlyq.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN2YmFqcnNjaXhiZ2ZvY3FxbHlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODAxODcxMzMsImV4cCI6MTk5NTc2MzEzM30.8L9E9yrzSMc85aa_8QT55vt0-WGFAiHwuUhMFchuhjQ"
  );
}

export async function action({request}: ActionArgs){
  return(
    json({message: "guess", correct: true})
  )
}

export default function GameRoute() {
  let data = useLoaderData()
  const fetcher = useFetcher();

  let randomAlbum: TopAlbumsGeneral = data.album;
  
  const [albumList, setAlbumList] = useState<TopAlbumsGeneral[]>([]);
  const [guessNumber, setGuessNumber] = useState(0); 
  const [guess, setGuess] = useState<string>("");

  async function handleChange(e: any){
    setGuess(e.target.value)
    let response = await fetch("/api/searchRecommendations?q=" + guess)
    .then(res => res.json())

    setAlbumList(response);

  }

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
      <Card h={"40rem"} w={"30rem"}overflow={"visible"}>
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
          <Box h='40px' >
            First Track: <Text hidden={guessNumber == 0}>{randomAlbum.tracks[0]}</Text>
          </Box>
          <Box h='40px'>
            Release Date: <Text hidden={guessNumber <= 1}>{randomAlbum.release_date}</Text>
          </Box>
          <Box h='40px'>
            Second Track: <Text hidden={guessNumber <= 2}>{randomAlbum.tracks[1]}</Text>
          </Box>
          <Box h='40px'>
            Recent Popularity (0-100): <Text hidden={guessNumber <= 3}>{randomAlbum.popularity}</Text>
          </Box>
          <Box h='40px'>
            Artist: <Text hidden={guessNumber <= 4}>{randomAlbum.artists[0].name}</Text>
          </Box>
        </VStack>
        </CardBody>
        <CardFooter>
          <fetcher.Form method="get">
            <input type="hidden" name="guessNumber" value={guessNumber} />
            <Box display={"flex"} flexDir={"row"}>
              <Input name="albumId" defaultValue={randomAlbum.id} hidden/>
              <Box display={"flex"} flexDir={"column"}>
                <Input w={"23rem"} type="search" name="guessValue" value={guess} onChange={e => handleChange(e)} hidden={guessNumber == 6} required/>
                <SearchRecommendationDropdown albumList={albumList} setGuess={setGuess} guessNumber={guessNumber}/>
              </Box>
              <Button type="submit" onClick={() => setGuessNumber(guessNumber + 1)}>Guess</Button>
            </Box>
          </fetcher.Form>
        </CardFooter>
      </Card>
    </Box>
  )
}