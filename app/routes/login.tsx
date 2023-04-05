import { Box } from "@chakra-ui/react";
import { Outlet } from "@remix-run/react";

export default function LoginRoute(){
  return(
    <Box h={"100vh"} w={"100vw"} display={"flex"} justifyContent={"center"} alignItems={"center"}>
      <Outlet />
    </Box>
  )
}