import { Button, Card, CardBody, CardFooter, CardHeader, Divider, Input, Stack, Text } from "@chakra-ui/react";
import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { useState } from "react";
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
  let test = await fetch(`https://api.spotify.com/v1/playlists/4KmcBdDIbHeO0alvCfk2TC?&limit=100`, {
    headers: {
      "Authorization": `Bearer ${params.accessToken}`,
      "Content-Type": "application/json"
    }
  }).then(res => res.json())
  console.log(test)
  return album;
}

export async function action({request}: ActionArgs){
  let formData = await request.formData();
  let guess: number = formData.get("guessNumber");
  guess = guess + 1;
  return {
    json: { guess }
  }
}

export default function GameRoute() {
  //let album: Album = useLoaderData();
  let data = useActionData()

  let guess: number = 0;
  console.log(guess)

  return(
    <Card w={"500px"} h={"600px"}>
      <CardHeader>
      </CardHeader>
      <CardBody>
        <Stack spacing={3}>
          <Text>1</Text>
        </Stack>
        <Divider />
        <Stack spacing={3}>
          <Text>2</Text>
        </Stack>
        <Divider />
        <Stack>
          <Text>3</Text>
        </Stack>
        <Divider />
        <Stack>
          <Text>4</Text>
        </Stack>
        <Divider />
        <Stack>
          <Text>5</Text>
        </Stack>
        <Divider />    
      </CardBody>
      <CardFooter>
        <Form>
          <Input />
          <Button type="submit"></Button>
        </Form>
      </CardFooter>
    </Card>
  )
}