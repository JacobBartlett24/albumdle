import type {  LoaderArgs } from "@remix-run/node"
import { json } from "@remix-run/node"

export async function loader({params}: LoaderArgs){
    return(
        json({message: "guess", correct: true})
    )
}

export function populateAlbumDatabase(){
    return(
        null
    )
}