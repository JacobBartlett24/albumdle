import type { LoaderArgs } from "@remix-run/node"; // or cloudflare/deno
import { json } from "@remix-run/node"; // or cloudflare/deno
import { useLoaderData } from "@remix-run/react";
import { db } from "~/utils/db.server";
import { createClient } from "@supabase/supabase-js";
import { supabase } from "~/utils/supabase.server"

export async function createSearchResults(guess: string){
  // const { data, error } = await supabase.from('TopAlbumsGeneral').select().('name', `%${guess}%`).limit(10)
  let { data, error } = await supabase
  .rpc('fuzzysearch', {guess: `%${guess}%`})

  if (error) console.error(error)

  return(data)
}

export async function loader({ request }: LoaderArgs) {
  const url = new URL(request.url);
  return json(
    await createSearchResults(url.searchParams.get("q")!)
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