import { Box, Button, Card, CardBody, Input, space } from "@chakra-ui/react"
import type { ActionArgs} from "@remix-run/node"
import { redirect} from "@remix-run/node"
import { Form } from "@remix-run/react"
import { supabase } from "~/utils/supabase.server"

export async function action({request} : ActionArgs){
  const formData = await request.formData()
  const email = formData.get("email")!.toString()
  const password = formData.get("password")!.toString()

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
      <Card>
        <CardBody>
          <Form method="post">
            <label>Email</label>
            <Input type="email" name="email" required/>
            <label>Password</label>
            <Input type="password" name="password" required/>
            <Button type={"submit"}>Login</Button>
          </Form>
        </CardBody>
      </Card>
    </Box>
  )
}