import { ListItem, List } from "@chakra-ui/react"
import type { TopAlbumsGeneral } from "@prisma/client"

type Props = {
  albumList: Array<TopAlbumsGeneral>,
  setGuess: Function,
  guessNumber: number,
}

export default function SearchRecommendationDropdown({albumList, setGuess, guessNumber}: Props){
  return(
    <>
      <List overflowY={"scroll"} w={"23rem"} top={"41.5rem"} borderRadius={"xl"} bg={"blackAlpha.400"} opacity={"100%"} position={"fixed"} spacing={0} hidden={guessNumber == 6}>
        {albumList.length > 0 ? albumList.map((album, i) => (
            i += 1,
            i <= 7 ?
            <ListItem _hover={{background: "white", cursor: "pointer"}} onClick={() => setGuess(album.name)} key={album.id} color={"black"} padding={"5px"}>
              {album.name}
            </ListItem>
            : null
          )): null}
      </List>
    </>
  )
}