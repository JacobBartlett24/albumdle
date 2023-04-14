import { Box, Text, Button, Card, CardBody, CardHeader, Input } from "@chakra-ui/react";
import type { ActionArgs } from "@remix-run/node";
import { redirect, json } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { AiFillGithub } from "react-icons/ai";
import { supabase } from "~/utils/supabase.server";
import styles from "../../utils/fonts.css"
export const links = () => {
  return [{ rel: "stylesheet", href: styles }];
};

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
    if(data.url){
      return redirect(data.url)
    }
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
    <Box fontFamily={"Inter"}>
      <Card bg={"brandwhite.900"} border={"1px solid black"} boxShadow={"white"} width={["15rem","23rem","30rem"]} height={["23rem","26rem","35rem"]} display={"flex"} justifyContent="center" alignItems={"center"} >
        <CardHeader fontSize={["xl","2xl","3xl"]}>Signup</CardHeader>
        <CardBody >
          <Form method="post" style={{height: "100%"}}>
            <Box display={"flex"} alignItems={"center"} justifyContent={"center"} flexDir={"column"} h={"90%"} >
              <label hidden>Email</label>
              <Input placeholder="Email..." mb={"3rem"} type="email" name="email"/>
              <label hidden>Password</label>
              <Input placeholder="Password..." mb={"3rem"} type="password" name="password"/>
              <Button type={"submit"} w={"100%"}>Signup</Button>
              <Text>or</Text>
              <Button colorScheme={"blackAlpha"} leftIcon={<AiFillGithub />} type={"submit"} value={"github"} name="github" colorScheme={"gray"}>Github</Button>
            </Box>
          </Form>
        </CardBody>
      </Card>
    </Box>
  )
}