import { Box, Button, Card, CardBody, CardHeader, Icon, Input, Text } from "@chakra-ui/react"
import type { ActionArgs} from "@remix-run/node"
import { redirect} from "@remix-run/node"
import { Form } from "@remix-run/react"
import { supabase } from "~/utils/supabase.server"
import { AiFillGithub } from "react-icons/ai"

async function signInWithGitHub() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'github',
  })
  return data
}

export async function action({request} : ActionArgs){
  const formData = await request.formData()
  const email = formData.get("email")!.toString()
  const password = formData.get("password")!.toString()

  if(formData.get("github") === "github"){
    let data = await signInWithGitHub()
    console.log(data.url)
    if(data.url){
      return redirect(data.url)
    }
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email: email,
    password: password,
  })

  if(error){
    return redirect("/login")
  }else if(data){
    return redirect("/game/123123")
  }
}

export default function Login(){
  return(
    <Box>
      <Card bg={"brandwhite.900"} border={"1px solid black"} boxShadow={"white"} width={"30rem"} height={"35rem"} display={"flex"} justifyContent="center" alignItems={"center"} >
        <CardHeader >Login</CardHeader>
        <CardBody >
          <Form method="post" style={{height: "100%"}}>
            <Box display={"flex"} alignItems={"center"} justifyContent={"center"} flexDir={"column"} h={"90%"} >
              <label hidden>Email</label>
              <Input placeholder="Email..." mb={"3rem"} type="email" name="email"/>
              <label hidden>Password</label>
              <Input placeholder="Password..." mb={"3rem"} type="password" name="password"/>
              <Button type={"submit"} w={"100%"}>Signup</Button>
              <Text>Or</Text>
              <Button colorScheme={"blackAlpha"} leftIcon={<AiFillGithub />} type={"submit"} value={"github"} name="github" w={"100%"}>Github</Button>
            </Box>
          </Form>
        </CardBody>
      </Card>
    </Box>
  )
}