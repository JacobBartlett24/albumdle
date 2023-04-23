import { json } from "@remix-run/node";
import type {ActionArgs, LoaderArgs} from "@remix-run/node";
import { useActionData, useFetcher, useLoaderData } from "@remix-run/react";
import { db } from "~/utils/db.server";
import type { TopAlbumsGeneral, DailyAlbum } from "@prisma/client";
import { Box, Button, Card, CardBody, CardFooter, CardHeader, Flex, FormLabel, Heading, Icon, Input, keyframes, Slide, Spinner, StackDivider, Text, useColorMode, useDisclosure, useMediaQuery, useTimeout, VStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import SearchRecommendationDropdown from "~/components/SearchRecommendationDropdown";
import Header from "~/components/Header";
import { BsMoonStarsFill } from "react-icons/bs";
import { AiTwotoneFire } from "react-icons/ai";
import { supabase } from "~/utils/supabase.server";
import styles from "../../utils/fonts.css"
import { createServerClient } from "@supabase/auth-helpers-remix";

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
  const response = new Response()
  const supabaseUrl = process.env.SUPABASE_URL
  const supabaseSecretKey = process.env.SUPABASE_KEY
  const supabase = createServerClient(
    supabaseUrl!,
    supabaseSecretKey!,
    { request, response })
  
  const {data} = await supabase.from('streaks').select('*')

  let album: TopAlbumsGeneral | null = await db.topAlbumsGeneral.findUnique({
    where: {
      albumId: dailyAlbumId!.albumId,
      },
    });
  const url = new URL(request.url);
  const guessValue: string = url.searchParams.get("guessValue")!;

  return json(
    {
    result: false,
    album: album,
    guessValue: guessValue,
    data: data
    }
    ,{
      headers: response.headers,
    });
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
  let mediaQuery = useMediaQuery("(prefers-color-scheme: dark)")
  let data = useLoaderData()
  const fetcher = useFetcher();
  const { isOpen, onToggle } = useDisclosure()
  const [isFocused, setFocus] = useState(false)

  
  const { colorMode, toggleColorMode } = useColorMode()

  let randomAlbum: TopAlbumsGeneral = data.album;
  
  const [albumList, setAlbumList] = useState<TopAlbumsGeneral[]>([]);
  const [guessNumber, setGuessNumber] = useState(0);
  const [obfuscatedName, setObfuscatedName] = useState<string>(obfuscate(randomAlbum.name!, guessNumber));
  const [guess, setGuess] = useState<string>("");

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

  // useEffect(() => {
  //   if(guessNumber > 0){
  //     setObfuscatedName(giveCharacter(randomAlbum.name!, guessNumber, obfuscatedName))
  //   }
  // }, [guessNumber])

  function obfuscate(albumName: string, guessNumber: number){
    let obfuscatedAlbumName: string = "";
    const regex = /\([^)]*\)/g;
    albumName = albumName.replace(regex, "");
    for(let i = 0; i < albumName.length; i++){
      if(albumName[i] === " "){
        obfuscatedAlbumName += "\xa0\xa0";
      } else {
        obfuscatedAlbumName += "_\xa0";
      }
    }
    // obfuscatedAlbumName = giveCharacter(albumName, guessNumber, obfuscatedAlbumName)
        
    return obfuscatedAlbumName;
  }

  // function giveCharacter(albumName: string, guessNumber: number, obfuscatedAlbumName: string){
  //   let randomNumber = Math.ceil(albumName.length * Math.random()) - 1
  //   obfuscatedAlbumName = obfuscatedAlbumName.replace(/ /g, "")
  //   obfuscatedAlbumName = obfuscatedAlbumName.substring(0, randomNumber) + albumName[randomNumber] + obfuscatedAlbumName.substring(randomNumber + 1)
  //   obfuscatedAlbumName = obfuscatedAlbumName.split('').join(' ')
  //   return obfuscatedAlbumName 
  // }

  let submissionState = fetcher.state === "idle" ? "Guess" :
                        fetcher.state === "loading" ? <Spinner /> :
                        fetcher.state === "submitting" ? <Spinner /> :
                        "Guess"

  return(
    <>
      <Header
          title={`Guess The Album Daily`} rightIcon={<Box></Box>} leftIcon={<Box></Box>} />
      <Box h={"100%"}fontFamily={"Inter"} display={"flex"} alignItems={"center"} justifyContent={"center"} overflow={"hidden"}>
        <Card
          boxShadow="white" 
          color={colorMode === "light" ? "black" : "white"}
          bg={colorMode === "light" ? "white" : "black"} 
          h={["35rem","35rem","43rem"]} 
          w={["20rem","32rem","43rem"]}
          overflow={"visible"}
          >
          <CardHeader display={"flex"} flexDir={"column"} alignItems={"center"}>
            <Text fontSize={["xl","2xl","3xl"]}>{guessNumber == 6 || fetcher.data?.correct ?  randomAlbum.name : obfuscatedName}</Text>
            <fetcher.Form method="post">
              <input type="hidden" name="guessNumber" value={guessNumber} />
              <Box m={"2rem 0"} display={"flex"} flexDir={"row"}>
                <Input name="albumId" defaultValue={randomAlbum.albumId!} hidden/>
                <Box pos={"relative"} display={"flex"} flexDir={"column"}>
                  
                  <Input 
                    bg={"blackAlpha.400"} 
                    boxShadow="white" 
                    h={["1.5rem","2rem","3rem"]} 
                    w={["13rem","20rem","23rem"]} 
                    type="search" 
                    autoComplete="off" 
                    name="guessValue" 
                    value={guess}
                    onFocus={() => setFocus(true)}
                    onChange={e => handleChange(e)} 
                    hidden={guessNumber == 6 || fetcher.data?.correct == true}
                    required/>
                      {guess == "" || fetcher.data?.correct == true ?
                   null : 
                   <SearchRecommendationDropdown 
                    isFocused={isFocused} 
                    setFocus={setFocus} 
                    albumList={albumList} 
                    setGuess={setGuess} 
                    guessNumber={guessNumber}/>}
                </Box>
                <Button
                  h={["1.5rem","2rem","3rem"]}
                  colorScheme="gray" 
                  isDisabled={guess === "" || fetcher.data?.correct == true} 
                  hidden={guessNumber == 6 } 
                  type="submit" 
                  onClick={() => setGuessNumber(guessNumber + 1)}>
                  {submissionState}
                </Button>
                <Text hidden={guessNumber != 6}>Bummer, maybe next time! 😜</Text>
              </Box>
            </fetcher.Form>
          </CardHeader>
          <CardBody>
          <VStack
            divider={<StackDivider borderColor='gray.200' />}
            spacing={4}
            align='stretch'
          >
            <Box h={["1.5rem","2rem","3rem"]} boxShadow="white" bg={colorMode === "light" ? "blackAlpha.400" : "whiteAlpha.300"} borderRadius={"lg"} display={"flex"} flexDir={"row"} alignItems={"center"} pl={"1rem"}>
              <FormLabel 
                isTruncated
                hidden={guessNumber > 0} 
                m={"0 2rem 0 0"} 
                display={"flex"} 
                alignContent={"center"} 
                justifyContent={"flex-end"} 
                color={colorMode === "light" ? "gray" : "white"} 
                >First Track:</FormLabel>
              <Text isTruncated hidden={guessNumber == 0}>{randomAlbum.tracks[0]}</Text>
            </Box>
            <Box h={["1.5rem","2rem","3rem"]} boxShadow="white" bg={colorMode === "light" ? "blackAlpha.400" : "whiteAlpha.300"} borderRadius={"lg"} display={"flex"} flexDir={"row"} alignItems={"center"} pl={"1rem"}>
              <FormLabel 
                hidden={guessNumber > 1} 
                m={"0 2rem 0 0"} 
                display={"flex"} 
                alignContent={"flex-end"} 
                justifyContent={"flex-end"} 
                color={colorMode === "light" ? "gray" : "white"}>Release Date:</FormLabel>
              <Text isTruncated  hidden={guessNumber <= 1}>{randomAlbum.release_date}</Text>
            </Box>
            <Box h={["1.5rem","2rem","3rem"]} boxShadow="white" bg={colorMode === "light" ? "blackAlpha.400" : "whiteAlpha.300"} borderRadius={"lg"} display={"flex"} flexDir={"row"} alignItems={"center"} pl={"1rem"}>
              <FormLabel 
                hidden={guessNumber > 2} 
                m={"0 2rem 0 0"} 
                display={"flex"} 
                alignContent={"flex-end"} 
                justifyContent={"flex-end"} 
                color={colorMode === "light" ? "gray" : "white"}>Second Track:</FormLabel> 
              <Text isTruncated hidden={guessNumber <= 2}>{randomAlbum.tracks[1]}</Text>
            </Box>
            <Box h={["1.5rem","2rem","3rem"]} boxShadow="white" bg={colorMode === "light" ? "blackAlpha.400" : "whiteAlpha.300"} borderRadius={"lg"} display={"flex"} flexDir={"row"} alignItems={"center"} pl={"1rem"}>
              <FormLabel hidden={guessNumber > 3} m={"0 2rem 0 0"} color={colorMode === "light" ? "gray" : "white"}>Recent Popularity (0-100):</FormLabel> 
              <Text isTruncated hidden={guessNumber <= 3}>{randomAlbum.popularity}</Text>
            </Box>
            <Box h={["1.5rem","2rem","3rem"]} boxShadow="white" bg={colorMode === "light" ? "blackAlpha.400" : "whiteAlpha.300"} borderRadius={"lg"} display={"flex"} flexDir={"row"} alignItems={"center"} pl={"1rem"}>
              <FormLabel 
                hidden={guessNumber > 4} 
                m={"0 2rem 0 0"} 
                display={"flex"} 
                alignContent={"flex-end"} 
                justifyContent={"flex-end"} 
                color={colorMode === "light" ? "gray" : "white"} >Artist:</FormLabel> 
              <Text isTruncated hidden={guessNumber <= 4}>{randomAlbum.artists[0].name}</Text>
            </Box>
          </VStack>
          </CardBody>
          <CardFooter display={"flex"} justifyContent={"center"}>

          </CardFooter>
        </Card>
        <Slide
            direction='bottom' 
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
      </Box>
    </>
  )
} 