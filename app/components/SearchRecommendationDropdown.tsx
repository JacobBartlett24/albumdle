import { ListItem, List, useColorMode, Box } from "@chakra-ui/react"
import type { TopAlbumsGeneral } from "@prisma/client"
import { useState } from "react"

type Props = {
  albumList: Array<TopAlbumsGeneral>,
  setGuess: Function,
  guessNumber: number,
  isFocused: boolean,
  setFocus: Function
}

export default function SearchRecommendationDropdown({albumList, setGuess, guessNumber, isFocused, setFocus}: Props){
  const { colorMode, toggleColorMode } = useColorMode()
  return(
    <>
    <Box position={"fixed"} left={"0"} onClick={() => setFocus(false)}  hidden={!isFocused} top={"0"}  h={"100vh"} w={"100vw"}>
    </Box>
      <List 
        color={colorMode === "light" ? "black" : "white"}
        bg={colorMode === "light" ? "white" : "black"}
        overflowY={"scroll"}
        w={["13rem","20rem","23rem"]}
        left={0}
        top={["1.8rem","2.6rem","3.3rem"]}
        borderRadius={"xl"}
        opacity={"100%"}
        position={"absolute"}
        spacing={0}
        hidden={guessNumber == 6 || !isFocused}>
        {albumList.length > 0 ? albumList.map((album, i) => (
            i += 1,
            i <= 7 ?
            <ListItem 
              borderBottom={"1px solid gray"} 
              _hover={{background: colorMode === "light" ? "black" : "white"  , cursor: "pointer", color: colorMode === "light" ? "white" : "black"}} 
              onClick={() => setGuess(album.name)} 
              key={album.name} 
              padding={"5px"}>
                {album.name}
            </ListItem>
            : ""
          )): ""}
      </List>
    </>
  )
}