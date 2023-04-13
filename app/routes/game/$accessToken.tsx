import { json } from "@remix-run/node";
import type {ActionArgs, LoaderArgs} from "@remix-run/node";
import { useActionData, useFetcher, useLoaderData } from "@remix-run/react";
import { db } from "~/utils/db.server";
import type { TopAlbumsGeneral, DailyAlbum } from "@prisma/client";
import { Box, Button, Card, CardBody, CardFooter, CardHeader, Flex, FormLabel, Heading, Icon, Input, keyframes, Slide, Spinner, StackDivider, Text, useColorMode, useDisclosure, useTimeout, VStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import SearchRecommendationDropdown from "~/components/SearchRecommendationDropdown";
import Header from "~/components/Header";
import { BsMoonStarsFill } from "react-icons/bs";
import { AiTwotoneFire } from "react-icons/ai";
import { supabase } from "~/utils/supabase.server";
import styles from "../../utils/fonts.css"

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
 
export const links = () => {
  return [{ rel: "stylesheet", href: styles }];
};

export async function loader({request}: LoaderArgs){
  let dailyAlbumId: DailyAlbum | null = await db.dailyAlbum.findFirst({
    orderBy: {
      created_at: "desc",
    },
  });

  let album: TopAlbumsGeneral | null = await db.topAlbumsGeneral.findUnique({
    where: {
      albumId: dailyAlbumId!.albumId,
      },
    });
  const url = new URL(request.url);
  const guessValue: string = url.searchParams.get("guessValue")!;
  const albumId: number = +url.searchParams.get("albumId")!;

  const { data, error } = await supabase.functions.invoke('hello-world', {
    body: { name: 'Functions' },
  })

  if(guessValue === album!.name){
  }
  return json({result: false, album: album, guessValue: guessValue});
}

export async function action({request, params}: ActionArgs){
  let formData = await request.formData();
  let albumId = formData.get("albumId")?.toString()
  let guessValue = formData.get("guessValue")?.toString()

  let correctAlbum = await db.topAlbumsGeneral.findUnique({
    where: {
      albumId: albumId!,
    },
  });

  if(guessValue === correctAlbum!.name){
    return json({correct: true})
  }

  return(
    json({ correct: false})
  )
}

export default function GameRoute() {
  let data = useLoaderData()
  const fetcher = useFetcher();
  const { isOpen, onToggle } = useDisclosure()
  
  const { colorMode, toggleColorMode } = useColorMode()

  let randomAlbum: TopAlbumsGeneral = data.album;
  
  const [albumList, setAlbumList] = useState<TopAlbumsGeneral[]>([]);
  const [guessNumber, setGuessNumber] = useState(0); 
  const [guess, setGuess] = useState<string>("");

  const shake = keyframes`
    0% { transform: translate(1px, 1px) rotate(0deg); }
    10% { transform: translate(-1px, -2px) rotate(-1deg); }
    20% { transform: translate(-3px, 0px) rotate(1deg); }
    30% { transform: translate(3px, 2px) rotate(0deg); }
    40% { transform: translate(1px, -1px) rotate(1deg); }
    50% { transform: translate(-1px, 2px) rotate(-1deg); }
    60% { transform: translate(-3px, 1px) rotate(0deg); }
    70% { transform: translate(3px, 1px) rotate(-1deg); }
    80% { transform: translate(-1px, -1px) rotate(1deg); }
    90% { transform: translate(1px, 2px) rotate(0deg); }
    100% { transform: translate(1px, -2px) rotate(-1deg); }
  `;

  const shakeAnimation = `${shake} 0.5s`;

  async function handleChange(e: any){
    setGuess(e.target.value)
    let response = await fetch("/api/searchRecommendations?q=" + guess)
    .then(res => res.json())

    setAlbumList(response);
  }

  useEffect(() => {
    if(fetcher.data?.correct){
      onToggle();
    }
  }, [fetcher.data?.correct])

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

  let submissionState = fetcher.state === "idle" ? "Guess" :
                        fetcher.state === "loading" ? <Spinner /> :
                        fetcher.state === "submitting" ? <Spinner /> :
                        "Guess"

  return(
    <>
    <Header
        title={`Guess The Album Daily`} 
        leftIcon={<Icon transition={"width .25s"} boxSize={6} as={BsMoonStarsFill} onClick={toggleColorMode} _hover={{cursor: "pointer", boxSize: "8"}}/>} 
        rightIcon={<Box display={"flex"} flexDir={"row"}><Text>1</Text><Icon transition={"width .25s"}  boxSize={6} as={AiTwotoneFire} _hover={{cursor: "pointer", boxSize: "8"}}/></Box>}/>
    <Box fontFamily={"Inter"}>
      
        <Slide
          direction='top' 
          in={isOpen} 
          style={{ zIndex: 10, display: "flex", justifyContent: "center" }}
          >
          <Box
            p='40px'
            color='green'
            mt='4'
            bg='white'
            rounded='md'
            shadow='md'
          >
            <Text fontWeight={"extrabold"} fontSize="2rem">{guessNumber == 1 ? `Correct in ${guessNumber} guess!` : `Correct in ${guessNumber} guesses!`}</Text>
          </Box>
        </Slide>

      <Card
        boxShadow="white" 
        color={colorMode === "light" ? "black" : "white"}
        bg={colorMode === "light" ? "white" : "black"} 
        h={"40rem"} 
        w={"60rem"}
        overflow={"visible"}
        >
        <CardHeader align={"center"}>
          <Text>{obfuscate(randomAlbum.name!)}</Text>
        </CardHeader>
        <CardBody>
        <VStack
          divider={<StackDivider borderColor='gray.200' />}
          spacing={4}
          align='stretch'
        >
          <Box h={"3rem"} boxShadow="white" bg={colorMode === "light" ? "blackAlpha.400" : "whiteAlpha.300"} borderRadius={"lg"} display={"flex"} flexDir={"row"} alignItems={"center"} pl={"1rem"}>
            <FormLabel m={"0 2rem 0 0"} display={"flex"} alignContent={"center"} justifyContent={"flex-end"} w={"13.4rem"}>First Track:</FormLabel>
            <Text hidden={guessNumber == 0}>{randomAlbum.tracks[0]}</Text>
          </Box>
          <Box h={"3rem"} boxShadow="white" bg={colorMode === "light" ? "blackAlpha.400" : "whiteAlpha.300"} borderRadius={"lg"} display={"flex"} flexDir={"row"} alignItems={"center"} pl={"1rem"}>
            <FormLabel m={"0 2rem 0 0"} display={"flex"} alignContent={"flex-end"} justifyContent={"flex-end"} w={"13.4rem"}>Release Date:</FormLabel>
            <Text hidden={guessNumber <= 1}>{randomAlbum.release_date}</Text>
          </Box>
          <Box h={"3rem"} boxShadow="white" bg={colorMode === "light" ? "blackAlpha.400" : "whiteAlpha.300"} borderRadius={"lg"} display={"flex"} flexDir={"row"} alignItems={"center"} pl={"1rem"}>
            <FormLabel m={"0 2rem 0 0"} display={"flex"} alignContent={"flex-end"} justifyContent={"flex-end"} w={"13.4rem"}>Second Track:</FormLabel> 
            <Text hidden={guessNumber <= 2}>{randomAlbum.tracks[1]}</Text>
          </Box>
          <Box h={"3rem"} boxShadow="white" bg={colorMode === "light" ? "blackAlpha.400" : "whiteAlpha.300"} borderRadius={"lg"} display={"flex"} flexDir={"row"} alignItems={"center"} pl={"1rem"}>
            <FormLabel m={"0 2rem 0 0"}>Recent Popularity (0-100):</FormLabel> 
            <Text hidden={guessNumber <= 3}>{randomAlbum.popularity}</Text>
          </Box>
          <Box h={"3rem"} boxShadow="white" bg={colorMode === "light" ? "blackAlpha.400" : "whiteAlpha.300"} borderRadius={"lg"} display={"flex"} flexDir={"row"} alignItems={"center"} pl={"1rem"}>
            <FormLabel m={"0 2rem 0 0"} display={"flex"} alignContent={"flex-end"} justifyContent={"flex-end"} w={"13.4rem"}>Artist:</FormLabel> 
            <Text hidden={guessNumber <= 4}>{randomAlbum.artists[0].name}</Text>
          </Box>
        </VStack>
        </CardBody>
        <CardFooter display={"flex"} justifyContent={"center"}>
          <fetcher.Form method="post">
            <input type="hidden" name="guessNumber" value={guessNumber} />
            <Box  display={"flex"} flexDir={"row"}>
              <Input name="albumId" defaultValue={randomAlbum.albumId} hidden/>
              <Box display={"flex"} flexDir={"column"}>
                <Input bg={"blackAlpha.400"} boxShadow="white" w={"23rem"} type="search" autoComplete="off" name="guessValue" value={guess} onChange={e => handleChange(e)} hidden={guessNumber == 6 || fetcher.data?.correct == true} required/>
                {guess == "" || fetcher.data?.correct == true ? null : <SearchRecommendationDropdown albumList={albumList} setGuess={setGuess} guessNumber={guessNumber}/>}
              </Box>
              <Button
                
                colorScheme="gray" 
                isDisabled={guess === "" || fetcher.data?.correct == true} 
                hidden={guessNumber == 6 } 
                type="submit" 
                onClick={() => setGuessNumber(guessNumber + 1)}>
                {submissionState}
              </Button>
              <Text hidden={guessNumber != 6}>You Suck!</Text>
            </Box>
          </fetcher.Form>
        </CardFooter>
      </Card>
    </Box>
    </>
  )
} 