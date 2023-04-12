import { ListItem, List, useColorMode } from "@chakra-ui/react"
import type { TopAlbumsGeneral } from "@prisma/client"

type Props = {
  albumList: Array<TopAlbumsGeneral>,
  setGuess: Function,
  guessNumber: number,
}

export default function SearchRecommendationDropdown({albumList, setGuess, guessNumber}: Props){
  const { colorMode, toggleColorMode } = useColorMode()
  return(
    <>
      <List 
        color={colorMode === "light" ? "black" : "white"}
        bg={colorMode === "light" ? "white" : "black"}
        overflowY={"scroll"}
        w={"23rem"}
        top={"42.5rem"}
        borderRadius={"xl"}
        opacity={"100%"}
        position={"fixed"}
        spacing={0}
         hidden={guessNumber == 6}>
        {albumList.length > 0 ? albumList.map((album, i) => (
            i += 1,
            i <= 7 ?
            <ListItem 
              borderBottom={"1px solid gray"} 
              _hover={{background: colorMode === "light" ? "black" : "white"  , cursor: "pointer", color: colorMode === "light" ? "white" : "black"}} 
              onClick={() => setGuess(album.name)} 
              key={album.id} 
              padding={"5px"}>
                {album.name}
            </ListItem>
            : null
          )): null}
      </List>
    </>
  )
}