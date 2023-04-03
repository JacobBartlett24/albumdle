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
    <List bg={"white"} spacing={0} hidden={guessNumber == 6}>
      {albumList.length > 0 ? albumList.map((album, i) => (
          i += 1,
          i <= 9 ?
          <ListItem _hover={{background: "teal", cursor: "pointer"}} onClick={() => setGuess(album.name)} key={album.id} color={"black"}>
            {album.name}
          </ListItem>
          : null
        )): null}
    </List>
    </>
  )
}