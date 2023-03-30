import { Card, CardBody, CardFooter, CardHeader } from "@chakra-ui/react";
import type { LoaderArgs } from "@remix-run/node";
import { useLoaderData } from "react-router";

type Album = {
  name: string;
  type: string;
  total_tracks: number;
  release_date: string;
  release_date_precision: string;
  genres: Array<string>;
  artists: Array<Artist>;
  popularity: number;
}

type Artist ={
  name: string;
}

async function loadRandomAlbum(accessToken: string | undefined){
  let searchResults: Array<any> = await fetch(`https://api.spotify.com/v1/search?q=year:2020&type=album&limit=50`, {
    headers: {
      "Authorization": `Bearer ${accessToken}`,
      "Content-Type": "application/json"
    }
  }).then(res => res.json())
  .then(data => data.albums.items);

  let newSearchResults: Array<Album> = mapAlbums(searchResults);
  const randomVinyl: Album = newSearchResults[Math.floor(Math.random() * newSearchResults.length)];

  return randomVinyl;
}

function mapAlbums(searchResults: any[]) {
  let newSearchResults: Array<Album> = [];  
  searchResults.map((album) => {
    newSearchResults.push({
      name: album.name,
      type: album.type,
      total_tracks: album.total_tracks,
      release_date: album.release_date,
      release_date_precision: album.release_date_precision,
      genres: album.genres,
      artists: album.artists,
      popularity: album.popularity
      } as Album)
  });
  return newSearchResults;
}

export async function loader({params}: LoaderArgs): Promise<Album>{
  let album: Promise<Album> = loadRandomAlbum(params.accessToken);

  return album;
}

export default function GameRoute() {
  let album: Album = useLoaderData();

  return(
    <Card>
      <CardHeader>

      </CardHeader>
      <CardBody>
      </CardBody>
      <CardFooter>
        
      </CardFooter>
    </Card>
  )
}