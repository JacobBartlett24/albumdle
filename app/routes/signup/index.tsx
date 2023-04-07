import { Box, Button, Card, CardBody, Input } from "@chakra-ui/react";
import type { ActionArgs } from "@remix-run/node";
import { redirect, json } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { supabase } from "~/utils/supabase.server";

export async function action({request} : ActionArgs){      
  const formData = await request.formData()
  const email = formData.get("email")!.toString()
  const password = formData.get("password")!.toString()

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
      <Card>
        <CardBody>
          <Form method="post">
            <label>Email</label>
            <Input type="email" name="email" required/>
            <label>Password</label>
            <Input type="password" name="password" required/>
            {error}
            <Button type={"submit"}>Signup</Button>
          </Form>
        </CardBody>
      </Card>
    </Box>
  )
}