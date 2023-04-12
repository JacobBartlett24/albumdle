import { Box, Text, Button, Card, CardBody, CardHeader, Input } from "@chakra-ui/react";
import type { ActionArgs } from "@remix-run/node";
import { redirect, json } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { supabase } from "~/utils/supabase.server";

async function signInWithGitHub() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'github',
  })
  console.log(`data: ${data.provider}`)
  console.log(`error: ${error}`)
}

export async function action({request} : ActionArgs){      
  const formData = await request.formData()
  const email = formData.get("email")!.toString()
  const password = formData.get("password")!.toString()

  if(formData.get("github") === "github"){
    signInWithGitHub()
    return null
  }

  console.log(formData.get("github"))

  const { data, error } = await supabase.auth.signUp({
    email: email,
    password: password,
  })

  if(error){
    console.log(error)
    return json({error: error})
  }else if(data){
    return redirect("/game/123123")
  }
}

export default function SignupRoute() {
  let error = useActionData()
  return(
    <Box>
      <Card border={"1px solid black"} boxShadow={"2xl"} width={"30rem"} height={"35rem"} display={"flex"} justifyContent="center" alignItems={"center"} >
        <CardHeader >Signup</CardHeader>
        <CardBody >
          <Form method="post" style={{height: "100%"}}>
            <Box display={"flex"} alignItems={"center"} justifyContent={"center"} flexDir={"column"} h={"90%"} >
              <label hidden>Email</label>
              <Input placeholder="Email..." mb={"3rem"} type="email" name="email"/>
              <label hidden>Password</label>
              <Input placeholder="Password..." mb={"3rem"} type="password" name="password"/>
              <Button type={"submit"} w={"100%"}>Signup</Button>
              <Text>Or</Text>
              <Button type={"submit"} value={"github"} name="github" w={"100%"}>github</Button>
            </Box>
          </Form>
        </CardBody>
      </Card>
    </Box>
  )
}