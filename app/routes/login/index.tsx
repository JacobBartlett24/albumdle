import { Box, Button, Card, CardBody, Input } from "@chakra-ui/react"
import type { ActionArgs} from "@remix-run/node"
import { redirect} from "@remix-run/node"
import { Form } from "@remix-run/react"
import { supabase } from "~/utils/supabase.server"

export async function action({request} : ActionArgs){      
  const { data, error } = await supabase.auth.signInWithPassword({
    email: 'exampless@email.com',
    password: 'example-password',
  })

  console.log(`data: ${data.user}`)
  console.log(`error: ${error}`)

  return redirect("/game/123123")
}

export default function Login(){
  return(
    <Box>
      <Card>
        <CardBody>
          <Form method="post">
            <label>Email</label>
            <Input type="email" name="email" />
            <label>Password</label>
            <Input type="password" name="password" />
            <Button type={"submit"}>Signup</Button>
          </Form>
        </CardBody>
      </Card>
    </Box>
  )
}