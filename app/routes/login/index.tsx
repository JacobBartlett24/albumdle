import { Box, Button, Card, CardBody, CardHeader, Icon, Input, Text } from "@chakra-ui/react"
import type { ActionArgs} from "@remix-run/node"
import { redirect} from "@remix-run/node"
import { Form } from "@remix-run/react"
import { AiFillGithub } from "react-icons/ai"
import styles from "../../utils/fonts.css"
import { createBrowserClient, createServerClient } from '@supabase/auth-helpers-remix'
import type { SupabaseClient } from '@supabase/auth-helpers-remix'


export const links = () => {
  return [{ rel: "stylesheet", href: styles }];
};

async function signInWithGitHub(supabase: SupabaseClient<any, "public", any>) {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'github',
  })
  return data
}

export async function action({request} : ActionArgs){
  const response = new Response() 

  const formData = await request.formData()
  const email = formData.get("email")!.toString()
  const password = formData.get("password")!.toString()

  const supabaseUrl = process.env.SUPABASE_URL
  const supabaseSecretKey = process.env.SUPABASE_KEY
  const supabase = createServerClient(
    supabaseUrl!,
    supabaseSecretKey!,
    { request, response })

  if(formData.get("github") === "github"){
    let data = await signInWithGitHub(supabase)
    console.log(data.url)
    if(data.url){
      return redirect(data.url)
    }
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email: email,
    password: password,
  })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  const user = session?.user

  console.log(user)
  
  if(error){
    return redirect("/login")
  }else if(data){
    
    return redirect("/game/123123")
  }
}

export default function Login(){
  return(
    <Box fontFamily={"Inter"}>
      <Card bg={"brandwhite.900"} border={"1px solid black"} boxShadow={"white"} width={["15rem","23rem","30rem"]} height={["23rem","26rem","35rem"]} display={"flex"} justifyContent="center" alignItems={"center"} >
        <CardHeader fontSize={["xl","2xl","3xl"]}>Login</CardHeader>
        <CardBody >
          <Form method="post" style={{height: "100%"}}>
            <Box display={"flex"} alignItems={"center"} justifyContent={"center"} flexDir={"column"} h={"90%"} >
              <label hidden>Email</label>
              <Input placeholder="Email..." mb={"3rem"} type="email" name="email"/>
              <label hidden>Password</label>
              <Input placeholder="Password..." mb={"3rem"} type="password" name="password"/>
              <Button type={"submit"} w={"100%"}>Login</Button>
              <Text>Or</Text>
              <Button colorScheme={"blackAlpha"} leftIcon={<AiFillGithub />} type={"submit"} value={"github"} name="github" w={"100%"}>Github</Button>
            </Box>
          </Form>
        </CardBody>
      </Card>
    </Box>
  )
}