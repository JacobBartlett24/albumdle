import type { LoaderArgs } from "@remix-run/node"; // or cloudflare/deno
import { json } from "@remix-run/node"; // or cloudflare/deno
import { useLoaderData } from "@remix-run/react";
import { db } from "~/utils/db.server";

export async function createSearchResults(guess){

  let results = 
  await db.topAlbumsGeneral.findMany({
    where: {
      name: {
        contains: guess,
      }
    },
  })

  return(results)
}

export async function loader({ request }: LoaderArgs) {
  const url = new URL(request.url);
  return json(
    await createSearchResults(url.searchParams.get("q"))
  );
}

export function SearchRecommendations() {
  let result = useLoaderData();
  return (
    <div>
      <h2>{result}</h2>
    </div>
  );
}